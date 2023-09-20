export enum OKSDKMode {
    Web = 'Web',
    Flash = 'Flash',
    Oauth = 'Oauth',
}

export enum ThemeOption {
    THEME_LIGHT = 'light',
    THEME_DARK = 'dark',
    THEME_AUTO = 'auto',
}

export enum ApiResultStatus {
    OK = 'ok',
    ERROR = 'error',
    CANCEL = 'cancel',
    EVENT = 'event',
}

export interface InitArguments {
    location_search?: string;
    location_hash?: string;
    app_id?: string;
    app_key?: string;
    oauth_scope?: string;
    oauth_url?: string;
    oauth_state?: string;
}

export type ApiResultData = Record<string, any> | string | boolean;

export type ApiCallback = (status: ApiResultStatus, data: ApiResultData) => void;

export type InvokeMethodFunction = (methodName: string, params?: (string | number | object | boolean | undefined)[], callback?: ApiCallback) => void;

export type UserCallback = (status: string, success: any, error: { error_msg: string } | null) => void;

export interface Invokable {
    invokeMethod: InvokeMethodFunction;
}

export interface IPhotoPickerConfig {
    showPrivate: boolean;
    showGif: boolean;
    sendPreviews: boolean;
    showOKAlbums: boolean;
    maxUploadCount: number;
    allowedFormats: string[];
    appName: string;
    previewSize: number;
    photoRestrictions: {
        minWidth: number;
        maxWidth: number;
        minHeight: number;
        maxHeight: number;
    };
    photoSetId: string;
}

export interface MethodResult {
    status: ApiResultStatus;
    data: Record<string, any> | string | boolean;
}

export interface IOKSDKMethods {
    Utils: {
        Mobile: {
            getPushNotificationsStatus: () => Promise<MethodResult>;
            suggestToEnablePushNotifications: () => Promise<MethodResult>;
            changeBottomDialogHeight: (currentHeight: string, newHeight: string, hideToolbarTitle?: boolean) => Promise<MethodResult>;
            getWebViewTextScale: () => Promise<MethodResult>;
            setWebViewTextScale: (percent: number) => Promise<MethodResult>;
            getIsLandscape: () => Promise<MethodResult>;
            registerOnBackInterrupter: () => Promise<MethodResult>;
            preventNativeBack: () => Promise<MethodResult>;
            showHideLocation: () => Promise<MethodResult>;
            updateStickerSets: () => Promise<MethodResult>;
        };

        isSupported: () => boolean;
        getRequestParameters: (search?: string) => Record<string, string>;
        getAppId: () => Promise<MethodResult>;
        getHash: () => Promise<MethodResult>;
        setHash: (hash: string) => Promise<MethodResult>;
        getPageInfo: () => Promise<MethodResult>;
        closeAppLayer: () => Promise<MethodResult>;
        fail: (message?: string) => Promise<MethodResult>;
        logger: (type: string, params: string[]) => Promise<MethodResult>;
        sendMessageToFrame: (targetFrameName: string, message: string) => Promise<MethodResult>;
        ping: (message?: string) => Promise<MethodResult>;
        observeServiceCallbacks: (events?: string, callback?: ApiCallback) => void;
        scrollTo: (x: number, y: number) => Promise<MethodResult>;
        scrollToTop: () => Promise<MethodResult>;
        playingTrack: () => Promise<MethodResult>;
        playPortalTrack: (trackId: string) => void;
        setWindowSize: (width: string, height: string) => Promise<MethodResult>;
        refreshProfileAvatar: () => void;
        refreshStatus: () => void;
        updateMemoriesPreview: (updateInfo: string) => void;
        requestFullscreen: () => Promise<MethodResult>;
        isAdBlockEnabled: () => Promise<MethodResult>;
    };

    Navigation: {
        changeHistory: (params: string) => void;
        changeHistoryReplace: (params: string) => void;
        goToApp: (params?: string) => Promise<MethodResult>;
        goToGiftsFront: (friendId?: string, selectedPresentId?: string, category?: string, bannerId?: string) => Promise<MethodResult>;
        goToGroup: (groupId: string, activityId: string, link?: string) => Promise<MethodResult>;
        goToThankYouGifts: (friendId: string) => Promise<MethodResult>;
        goToUser: (userId: string, link?: string) => Promise<MethodResult>;
    };

    Payment: {
        showPayment: (name: string, description: string, code: string, price: string, options: string, attributes: string, currency: string, callback: string, uiConf: string) => void;
        showPaymentCardOnly: (name: string, description: string, code: string, price: string, options: string, attributes: string, currency: string, callback: string, uiConf: string) => void;
        showPaymentForApp: (
            name: string,
            description: string,
            code: string,
            price: string,
            options: string,
            attributes: string,
            currency: string,
            callback: string,
            uiConf: string,
            appId: string,
            appOptionCode: string
        ) => void;
        showPaymentSubscription: (code: string, price: string) => void;
        showPromo: (presentId: string, holidayId: string, isNeedCallback: string, appId: string, statisticsData: string, paymentMode: string, filterType: string) => void;
        showPromoPayment: (userId: string, presentId: string, paymentMode?: string, holidayId?: string, promoAppId?: string, statisticsData?: string, price?: string) => void;
        showPaymentPromo: () => Promise<MethodResult>;
        showPortalPayment: (action?: string) => Promise<MethodResult>;
        showSendOkPayment: (userId: string, friendId: string, paymentMode: string, price: string, fixed: string, serviceId: string) => void;
        showActivePaymentSubscriptions: () => void;
    };

    Layers: {
        joinGroup: (groupId: string, enableMessaging?: boolean) => Promise<MethodResult>;
        openSubApp: (appId: string, customArgs?: string, refPlace?: string, customFrameName?: string) => Promise<MethodResult>;
        closeSubApp: () => Promise<MethodResult>;
        postMediatopic: (attachment: Object, status?: boolean, platforms?: string[]) => Promise<MethodResult>;
        showGroupPermissions: (permissions: string, groupId: string) => Promise<MethodResult>;
        showGroupTopic: (topicId: string) => Promise<MethodResult>;
        showInvite: (text: string, params: string, selectedUids: string) => Promise<MethodResult>;
        showLoginSuggestion: (gameState: String) => Promise<MethodResult>;
        showNotification: (text: string, params: string, selectedUids: string) => Promise<MethodResult>;
        showRatingDialog: () => Promise<MethodResult>;
        showSendPresent: (friendId?: string) => void;
        showSendPresentFromConstructor: (presentId: string, statisticsData: string) => void;
        showCloseConfirmation: () => void;
        showFriendSelectLayer: (paymentMode: string, price: string, fixedPrice: string, sendOk: string, statisticsData: string) => void;
        showPermissions: (permissions: string | string[], uiConf: string) => void;
        avatarDecorationInstalled: (decorationId: string, mainPhotoSet: string) => Promise<MethodResult>;
        successProfileDecorated: (decorationId: string, lottieContent: string, lottieWidthStr: string, lottieHeightStr: string) => Promise<MethodResult>;
        showLogin: (gameState: string) => Promise<MethodResult>;
        openMessages: (conversationId: string) => void;
        openPhotoPicker: (config: IPhotoPickerConfig) => void;
        openProfile: (profileId: string) => void;
        requestDesktopIcon: () => Promise<MethodResult>;
        showReshareMenu: (refId1: string, refId2: string, reshareType: string) => void;
    };

    Ads: {
        Banner: {
            requestBannerAds: (callback?: ApiCallback) => void;
            showBannerAds: (position?: string, callback?: ApiCallback) => void;
            hideBannerAds: (callback?: ApiCallback) => void;
            isBannerAdsVisible: (callback?: ApiCallback) => void;
            setBannerFormat: (format: string) => Promise<MethodResult>;
            getBannerFormats: () => Promise<MethodResult>;
        };

        Interstitial: {
            prepareInterstitial: (callback?: ApiCallback) => void;
            showInterstitial: (callback?: ApiCallback) => void;
            showAd: (callback?: ApiCallback) => void;
        };

        Rewarded: {
            loadAd: (callback?: ApiCallback) => void;
            prepareMidroll: (callback?: ApiCallback) => void;
            showMidroll: (callback?: ApiCallback) => void;
            showLoadedAd: (callback?: ApiCallback) => void;
        };

        Mobile: {
            requestNativeAd: (callback?: ApiCallback) => void;
            requestManualAd: (callback?: ApiCallback) => void;
            //@ts-ignore
            isNativeAdSupported: () => boolean;
        };
    };
}

export interface IOKSDKClient {
    call: (params: Record<string, string>, userCallback?: UserCallback, resig?: string) => void;
}

export interface IOKSDK {
    init: (initArguments?: InitArguments, successCallback?: (mode?: OKSDKMode) => void, failureCallback?: (message: string) => void) => Promise<string>;

    invoke: InvokeMethodFunction;

    /**
    * @deprecated The method is created only for back compatibility
    */
    invokeUIMethod: InvokeMethodFunction;

    Methods: IOKSDKMethods;

    Theme: {
        THEME_LIGHT: string;
        THEME_DARK: string;
        getTheme: () => ThemeOption;
        _setThemeSetting: (themeSetting: ThemeOption) => void;
    };

    Client: IOKSDKClient;
}
