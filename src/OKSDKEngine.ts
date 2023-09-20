import { OKSDKMethods, OKSDKOauth, OKSDKHtml, OKSDKClient } from './OKSDKModules';
import { ThemeService } from './theme';
import { ApiCallback, ApiResultStatus, InitArguments, Invokable, IOKSDKMethods, OKSDKMode } from './types';
import { Utils } from './utils';

export class OKSDKEngine implements Invokable {
    initialized: boolean = false;
    successCallback: (mode?: OKSDKMode) => void = () => {};
    errorCallback: (message: string) => void = () => {};
    mode: OKSDKMode | undefined = undefined;

    markInitialized = () => {
        this.initialized = true;
        this.successCallback(this.mode);
    };

    themeService = new ThemeService();
    oksdkClient = new OKSDKClient();
    oksdkOauth = new OKSDKOauth(this);
    oksdkHtml = new OKSDKHtml(this);

    init = (initArguments?: InitArguments, successCallback?: (mode?: OKSDKMode) => void, failureCallback?: (message: string) => void): Promise<string> =>
        new Promise((resolve, reject) => {
            const args = initArguments || {};
            this.successCallback = (mode?: OKSDKMode) => {
                successCallback?.(mode);
                resolve(mode!);
            };

            this.errorCallback = (message: string) => {
                failureCallback?.(message);
                reject(message!);
            };

            if (this.initialized) {
                this.successCallback(this.mode);
            }

            const params = Utils.getRequestParameters(args?.location_search || window.location.search);
            const hParams = Utils.getRequestParameters(args?.location_hash || window.location.hash);

            const api_server = params.api_server;
            const apiConnection = params.apiconnection;

            this.oksdkClient.init(params, hParams, args);

            if (api_server) {
                if (!apiConnection) {
                    this.errorCallback('There is no apiconnection argument provided');
                }

                this.mode = OKSDKMode.Web;
                if (!Utils.isFunc(window.postMessage)) {
                    this.errorCallback('Flash application is no longer supported');
                    return;
                } else {
                    this.invokeMethod = this.oksdkHtml.invokeMethod;
                    this.oksdkHtml.init(params);
                }
            } else {
                if (!args.app_id || !args.app_key) {
                    this.errorCallback('OKSDK was unable to detect launch platform. URL parameters and app_id/app_key not detected.');
                    return;
                }
                this.mode = OKSDKMode.Oauth;
                this.oksdkOauth.init(args, hParams);
            }
        });

    invokeMethod = (methodName: string, params?: (string | number | object | boolean | undefined)[], callback?: ApiCallback): void => {
        callback?.(ApiResultStatus.ERROR, { error_code: -1, error_message: 'UI methods are available only for apps running on OK portal' });
    };

    serviceEvent = (name: string, value: string) => {
        switch (name) {
            case 'DEVICE_THEME':
                this.themeService._setThemeSetting(value);
                break;
        }
    };

    Methods: IOKSDKMethods = new OKSDKMethods(this);
}
