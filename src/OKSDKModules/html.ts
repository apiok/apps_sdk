import { OKSDKEngine } from '../OKSDKEngine';
import { ApiCallback, ApiResultData, ApiResultStatus, Invokable } from '../types';
import { Utils } from '../utils';

export class OKSDKHtml implements Invokable {
    webServerUrl: string = '';
    attachRetryCounter: number = 0;
    offlineAllowedMethods = [
        'attach',
        'fail',
        'ping',
        'getHash',
        'setHash',
        'changeHistory',
        'getAppId',
        'getPageInfo',
        'setWindowSize',
        'scrollTo',
        'scrollToTop',
        'gok',
        'changeBottomDialogHeight',
        'setWebViewTextScale',
    ];

    private callbacksStorage: Record<string, ApiCallback | undefined> = {};

    constructor(private oksdkEngine: OKSDKEngine) {}

    init = (params: Record<string, string>) => {
        this.attachRetryCounter = 0;

        if (!this.oksdkEngine.initialized) {
            this.webServerUrl = params['web_server'];
            if (this.webServerUrl.indexOf('://') == -1) {
                this.webServerUrl = 'http://' + this.webServerUrl;
            }

            if (Utils.isFunc(window.addEventListener)) {
                window.addEventListener('message', this.onPostMessage, false);
            } else {
                //@ts-ignore
                window.attachEvent('onmessage', this.onPostMessage);
            }
            this.doAttach();
        }
    };

    doAttach = () => {
        if (!this.oksdkEngine.initialized) {
            // Retrying attaching to odkl server window, trying 20 times each half of second
            if (this.attachRetryCounter++ < 20) {
                this.invokeMethod('attach');
                setTimeout(this.doAttach, 500);
            } else {
                this.oksdkEngine.errorCallback('Failed to init.');
            }
        }
    };

    onPostMessage = (event: MessageEvent) => {
        if (this.webServerUrl != event.origin) {
            // Not our message
            return;
        }
        
        const args = event.data.split('$');

        if (args.length != 3) {
            // Not our message
            return;
        }

        const methodName = decodeURIComponent(args[0]);
        switch (methodName) {
            case 'attach':
                this.oksdkEngine.markInitialized();
                return;
            case 'serviceEvent':
                if (args[1] === 'ok') {
                    const serviceData = args[2].split(':');
                    this.oksdkEngine.serviceEvent(serviceData[0], serviceData[1]);
                }
            default:
                const callback = this.callbacksStorage[methodName];
                const status = decodeURIComponent(args[1]) as ApiResultStatus;
                const rawData = decodeURIComponent(args[2]);

                let parsedData: ApiResultData = rawData;
                try {
                    parsedData = JSON.parse(rawData);
                } catch (e) {
                    if (rawData === 'true') {
                        parsedData = true;
                    } else if (rawData === 'false') {
                        parsedData = false;
                    }
                }

                callback?.(status, parsedData);
        }
    };

    invokeMethod = (methodName: string, params?: (string | number | object | boolean | undefined)[], callback?: ApiCallback): void => {
        this.callbacksStorage[methodName] = callback;

        if (!Utils.isOnline() && !this.offlineAllowedMethods.includes(methodName)) {
            callback?.(ApiResultStatus.ERROR, 'no_network');
            return;
        }

        let argStr = `${methodName}`;

        if (params && params.length > 0) {
            // Remove last undefineds
            const paramsLocal = [...params];
            while (paramsLocal[paramsLocal.length - 1] === undefined && paramsLocal.length !== 0) {
                paramsLocal.pop();
            }

            for (let i = 0; i < paramsLocal.length; i++) {
                let param = paramsLocal[i];

                argStr += '$';

                if (param != null) {
                    argStr += encodeURIComponent(typeof param === 'object' ? JSON.stringify(param) : String(param));
                }
            }
        }

        parent.postMessage('__FAPI__' + argStr, this.webServerUrl);
    };
}
