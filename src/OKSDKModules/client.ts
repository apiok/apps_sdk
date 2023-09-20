import { IOKSDKClient as IOKSDKClient, InitArguments, UserCallback } from '../types';
import { Utils } from '../utils';

export class OKSDKClient implements IOKSDKClient {
    applicationKey?: string = undefined;
    sessionKey?: string = undefined;
    accessToken?: string = undefined;
    sessionSecretKey?: string = undefined;
    apiServer?: string = undefined;
    baseUrl?: string = undefined;
    uid?: string = undefined;
    format: string = 'JSON';
    initialized: boolean = false;

    params: Record<string, string> = {};
    hParams: Record<string, string> = {};
    
    init = (params?: Record<string, string>, hParams?: Record<string, string>, args?: InitArguments) => {
        if (this.initialized) {
          return;
        } 
        
        this.params = params || Utils.getRequestParameters();
        this.hParams = hParams || {};
        this.uid = this.params['logged_user_id'];

        this.applicationKey = this.params['application_key'] || args?.['app_key'];
        this.sessionKey = this.params['session_key'];
        this.accessToken = this.hParams['access_token'];
        this.sessionSecretKey = this.params['session_secret_key'] || this.hParams['session_secret_key'];
        this.apiServer = this.params['api_server'] || 'https://api.ok.ru/';
        this.baseUrl = this.apiServer + 'fb.do';

        this.initialized = true;
    };

    load = (url: string, callback?: UserCallback) =>
        new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open('GET', url, true);
            xhr.setRequestHeader('Content-type', 'application/json');

            xhr.ontimeout = () => {
                const result = {
                    error_msg: 'Request timeout: ' + xhr.timeout + 'ms',
                };
                callback?.('error', null, result);
                reject(result);
            };

            xhr.onerror = () => {
                const result = { error_msg: 'Error on sending request' };
                callback?.('error', null, result);
                reject(result);
            };

            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    let responseJson;
                    try {
                        responseJson = JSON.parse(xhr.responseText);
                    } catch (e) {
                        responseJson = {
                            error_msg: xhr.responseText || 'Something went wrong during request',
                        };
                    }

                    if (xhr.status !== 200 || (responseJson && responseJson.hasOwnProperty('error_msg'))) {
                        // timeout or error
                        if (xhr.status === 0) {
                            return;
                        }

                        if (xhr.status !== 200) {
                            responseJson.status_code = xhr.status;
                            responseJson.status_text = xhr.statusText;
                        }

                        callback?.('error', null, responseJson);
                        reject(responseJson);
                    } else {
                        callback?.('ok', responseJson, null);
                        resolve(responseJson);
                    }
                }
            };

            xhr.send(null);
        });

    call = (params: Record<string, string>, userCallback?: UserCallback, resig?: string) => {
        if (!this.initialized) {
            this.init();
        }

        let query = '?';
        const localParams = this.fillParams(params);
        localParams['sig'] = Utils.calcSignature(localParams, this.sessionSecretKey!);
        if (resig != null) {
            localParams['resig'] = resig;
        }
        for (let key in localParams) {
            if (localParams.hasOwnProperty(key)) {
                query += key + '=' + encodeURIComponent(localParams[key]) + '&';
            }
        }

        return this.load(this.baseUrl + query, userCallback);
    };

    calcSignature = (params: Record<string, string>) => {
        if (!this.initialized) {
            this.init();
        }
        const localParams = this.fillParams(params);
        return Utils.calcSignature(localParams, this.sessionSecretKey!);
    };

    fillParams = (params: Record<string, string>) => {
        if (!this.initialized) {
            this.init();
        }
        const localParams = { ...(params || {}) };
        localParams['application_key'] = this.applicationKey!;
        if (this.sessionKey) {
            localParams['session_key'] = this.sessionKey!;
        } else {
            localParams['access_token'] = this.accessToken!;
        }
        localParams['format'] = this.format;
        return localParams;
    };
}
