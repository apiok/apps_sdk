import { MD5 } from './md5';

export class Utils {
    static isFunc = (obj: unknown): obj is Function => Object.prototype.toString.call(obj) === '[object Function]';

    static isString = (obj: unknown): obj is string => Object.prototype.toString.call(obj) === '[object String]';

    static calcSignature = (query: any, secret: string) => {
        const keys = [];

        for (let i in query) {
            keys.push(i.toString());
        }

        keys.sort();

        let sign = '';
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if ('sig' != key && 'resig' != key && 'access_token' != key) {
                sign += keys[i] + '=' + query[keys[i]];
            }
        }
        sign += secret;
        sign = Utils.encodeUtf8(sign);
        return MD5.instance.calc(sign);
    };

    static encodeUtf8 = (str: string) => {
        let res = '';
        for (let n = 0; n < str.length; n++) {
            const c = str.charCodeAt(n);
            if (c < 128) {
                res += String.fromCharCode(c);
            } else if (c > 127 && c < 2048) {
                res += String.fromCharCode((c >> 6) | 192);
                res += String.fromCharCode((c & 63) | 128);
            } else {
                res += String.fromCharCode((c >> 12) | 224);
                res += String.fromCharCode(((c >> 6) & 63) | 128);
                res += String.fromCharCode((c & 63) | 128);
            }
        }
        return res;
    };

    static getRequestParameters = (search?: string) => {
        const res: Record<string, string> = {};
        let url = search || window.location.search;
        if (url) {
            url = url.substr(1); // Drop the leading '?' / '#'
            const nameValues = url.split('&');
            nameValues.forEach((nameValueStr) => {
                const [name, value] = nameValueStr.split('=');
                if (name !== undefined && value !== undefined) {
                    res[name] = decodeURIComponent(value.replace(/\+/g, ' '));
                }
            });
        }
        return res;
    };

    static isOnline = () => !navigator || navigator.onLine;
}
