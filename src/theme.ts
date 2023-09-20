import { ThemeOption } from './types';
import { Utils } from './utils';

const darkThemeModifier = '__ui-theme_dark';
const lightThemeModifier = '__ui-theme_light';

export class ThemeService {
    params: Record<string, string>;
    themeSetting?: string;
    root: HTMLElement;
    autoThemeDetect?: MediaQueryList;

    constructor() {
        this.params = Utils.getRequestParameters();
        this.themeSetting = this.params.theme;
        this.root = document.documentElement;
        this.autoThemeDetect = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

        if (this.autoThemeDetect) {
            if (Utils.isFunc(this.autoThemeDetect.addEventListener)) {
                this.autoThemeDetect.addEventListener('change', this.onMediaQueryChange);
            } else if (Utils.isFunc(this.autoThemeDetect.addListener)) {
                this.autoThemeDetect.addListener(this.onMediaQueryChange);
            }
        }

        this.updateCssClass();
    }

    onMediaQueryChange = () => {
        if (this.themeSetting === ThemeOption.THEME_AUTO) {
            this.updateTheme();
        }
    };

    getTheme = () => {
        switch (this.themeSetting) {
            case ThemeOption.THEME_DARK:
                return ThemeOption.THEME_DARK;
            case ThemeOption.THEME_AUTO:
                if (this.autoThemeDetect?.matches) {
                    return ThemeOption.THEME_DARK;
                } else {
                    return ThemeOption.THEME_LIGHT;
                }
            default:
                return ThemeOption.THEME_LIGHT;
        }
    };

    updateCssClass = () => {
        const theme = this.getTheme();

        this.root.classList.remove(darkThemeModifier, lightThemeModifier);

        switch (theme) {
            case ThemeOption.THEME_DARK:
                this.root.classList.add(darkThemeModifier);
                break;
            default:
                this.root.classList.add(lightThemeModifier);
                break;
        }
    };

    updateTheme = () => {
        this.updateCssClass();
        document.body.dispatchEvent(
            new CustomEvent('ok-theme-changed', {
                detail: this.getTheme(),
            })
        );
    };

    _setThemeSetting = (_themeSetting: string) => {
        this.themeSetting = _themeSetting;
        this.updateTheme();
    };
}
