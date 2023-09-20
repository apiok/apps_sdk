import { OKSDKEngine } from 'src/OKSDKEngine';
import { InitArguments } from '../types';

export class OKSDKOauth {
    constructor(private oksdkEngine: OKSDKEngine) {}

    init = (args: InitArguments, hParams: Record<string, string>) => {
        if (hParams['access_token'] == null && hParams['error'] == null) {
            window.location.assign(
                'https://connect.ok.ru/oauth/authorize' +
                    '?client_id=' +
                    args.app_id +
                    '&scope=' +
                    (args.oauth_scope || 'VALUABLE_ACCESS') +
                    '&response_type=token' +
                    '&redirect_uri=' +
                    (args.oauth_url || window.location.href) +
                    '&layout=a' +
                    '&state=' +
                    (args.oauth_state || '')
            );
            return;
        }

        if (hParams['error'] != null) {
            this.oksdkEngine.errorCallback('Error with OAUTH authorization: ' + hParams['error']);
            return;
        }
        this.oksdkEngine.markInitialized();
    };
}
