import { OKSDKEngine } from './OKSDKEngine';
import { IOKSDK, IOKSDKClient, InvokeMethodFunction, ThemeOption } from './types';

export class OKSDK implements IOKSDK {
    private _engine = new OKSDKEngine();

    init = this._engine.init;

    invoke: InvokeMethodFunction = (...args) => this._engine.invokeMethod(...args);

    invokeUIMethod = this.invoke;

    Methods = this._engine.Methods;

    Theme = {
        THEME_LIGHT: ThemeOption.THEME_LIGHT,
        THEME_DARK: ThemeOption.THEME_DARK,
        getTheme: this._engine.themeService.getTheme,
        _setThemeSetting: this._engine.themeService._setThemeSetting,
    };

    Client: IOKSDKClient = {
        call: (...args) => this._engine.oksdkClient.call(...args),
    };
}
