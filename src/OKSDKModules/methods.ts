import { Utils } from 'src/utils';
import type { OKSDKEngine } from '../OKSDKEngine';
import { ApiCallback, IOKSDKMethods, IPhotoPickerConfig, MethodResult, OKSDKMode } from '../types';

const getPromisifiedCallbackMethod = (oksdk: OKSDKEngine, methodName: string, ...args: any[]) => {
    return new Promise<MethodResult>((res, rej) =>
        oksdk.invokeMethod(methodName, args, (status, data) => {
            res({ status, data });
        })
    );
};

export class OKSDKMethods implements IOKSDKMethods {
    constructor(private oksdk: OKSDKEngine) {}

    Utils = {
        Mobile: {
            getPushNotificationsStatus: () => getPromisifiedCallbackMethod(this.oksdk, 'getPushNotificationsStatus'),
            suggestToEnablePushNotifications: () => getPromisifiedCallbackMethod(this.oksdk, 'suggestToEnablePushNotifications'),
            changeBottomDialogHeight: (currentHeight: string, newHeight: string, hideToolbarTitle?: boolean) =>
                getPromisifiedCallbackMethod(this.oksdk, 'changeBottomDialogHeight', currentHeight, newHeight, hideToolbarTitle),
            getWebViewTextScale: () => getPromisifiedCallbackMethod(this.oksdk, 'getWebViewTextScale'),
            setWebViewTextScale: (percent: number) => getPromisifiedCallbackMethod(this.oksdk, 'setWebViewTextScale', percent),
            getIsLandscape: () => getPromisifiedCallbackMethod(this.oksdk, 'getIsLandscape'),
            registerOnBackInterrupter: () => getPromisifiedCallbackMethod(this.oksdk, 'registerOnBackInterrupter'),
            preventNativeBack: () => getPromisifiedCallbackMethod(this.oksdk, 'preventNativeBack'),
            showHideLocation: () => getPromisifiedCallbackMethod(this.oksdk, 'showHideLocation'),
            updateStickerSets: () => getPromisifiedCallbackMethod(this.oksdk, 'updateStickerSets'),
        },

        isSupported: () => this.oksdk.mode == OKSDKMode.Web,
        getRequestParameters: Utils.getRequestParameters,
        getAppId: () => getPromisifiedCallbackMethod(this.oksdk, 'getAppId'),
        getHash: () => getPromisifiedCallbackMethod(this.oksdk, 'getHash'),
        setHash: (hash: string) => getPromisifiedCallbackMethod(this.oksdk, 'setHash', hash),
        getPageInfo: () => getPromisifiedCallbackMethod(this.oksdk, 'getPageInfo'),
        closeAppLayer: () => getPromisifiedCallbackMethod(this.oksdk, 'closeAppLayer'),
        fail: (message?: string) => getPromisifiedCallbackMethod(this.oksdk, 'fail', message),
        logger: (type: string, params: string[]) => getPromisifiedCallbackMethod(this.oksdk, 'logger', type, params),
        sendMessageToFrame: (targetFrameName: string, message: string) => getPromisifiedCallbackMethod(this.oksdk, 'sendMessageToFrame', targetFrameName, message),
        ping: (message?: string) => getPromisifiedCallbackMethod(this.oksdk, 'ping', message),
        observeServiceCallbacks: (events?: string, callback?: ApiCallback) => this.oksdk.invokeMethod('observeServiceCallbacks', [events], callback),
        scrollTo: (x: number, y: number) => getPromisifiedCallbackMethod(this.oksdk, 'scrollTo', x, y),
        scrollToTop: () => getPromisifiedCallbackMethod(this.oksdk, 'scrollToTop'),
        playingTrack: () => getPromisifiedCallbackMethod(this.oksdk, 'playingTrack'),
        playPortalTrack: (trackId: string) => this.oksdk.invokeMethod('playPortalTrack', [trackId]),
        setWindowSize: (width: string, height: string) => getPromisifiedCallbackMethod(this.oksdk, 'setWindowSize', width, height),
        refreshProfileAvatar: () => this.oksdk.invokeMethod('refreshProfileAvatar'),
        refreshStatus: () => this.oksdk.invokeMethod('refreshStatus'),
        updateMemoriesPreview: (updateInfo: string) => this.oksdk.invokeMethod('updateMemoriesPreview', [updateInfo]),
        requestFullscreen: () => getPromisifiedCallbackMethod(this.oksdk, 'requestFullscreen'),
        isAdBlockEnabled: () => getPromisifiedCallbackMethod(this.oksdk, 'isAdBlockEnabled'),
    };

    Navigation = {
        changeHistory: (params: string) => this.oksdk.invokeMethod('changeHistory', [params]),
        changeHistoryReplace: (params: string) => this.oksdk.invokeMethod('changeHistory', [params, true]),
        goToApp: (params?: string) => getPromisifiedCallbackMethod(this.oksdk, 'goToApp', params),
        goToGiftsFront: (friendId?: string, selectedPresentId?: string, category?: string, bannerId?: string) =>
            getPromisifiedCallbackMethod(this.oksdk, 'goToGiftsFront', friendId, selectedPresentId, category, bannerId),
        goToGroup: (groupId: string, activityId: string, link?: string) => getPromisifiedCallbackMethod(this.oksdk, 'goToGroup', groupId, activityId, link),
        goToThankYouGifts: (friendId: string) => getPromisifiedCallbackMethod(this.oksdk, 'goToThankYouGifts', friendId),
        goToUser: (userId: string, link?: string) => getPromisifiedCallbackMethod(this.oksdk, 'goToUser', userId, link),
    };

    Payment = {
        showPayment: (name: string, description: string, code: string, price: string, options: string, attributes: string, currency: string, callback: string, uiConf: string) =>
            this.oksdk.invokeMethod('showPayment', [name, description, code, price, options, attributes, currency, callback, uiConf]),
        showPaymentCardOnly: (name: string, description: string, code: string, price: string, options: string, attributes: string, currency: string, callback: string, uiConf: string) =>
            this.oksdk.invokeMethod('showPaymentCardOnly', [name, description, code, price, options, attributes, currency, callback, uiConf]),
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
        ) => this.oksdk.invokeMethod('showPaymentForApp', [name, description, code, price, options, attributes, currency, callback, uiConf, appId, appOptionCode]),
        showPaymentSubscription: (code: string, price: string) => this.oksdk.invokeMethod('showPaymentSubscription', [code, price]),
        showPromo: (presentId: string, holidayId: string, isNeedCallback: string, appId: string, statisticsData: string, paymentMode: string, filterType: string) =>
            this.oksdk.invokeMethod('showPromo', [presentId, holidayId, isNeedCallback, appId, statisticsData, paymentMode, filterType]),
        showPromoPayment: (userId: string, presentId: string, paymentMode?: string, holidayId?: string, promoAppId?: string, statisticsData?: string, price?: string) =>
            this.oksdk.invokeMethod('showPromoPayment', [userId, presentId, paymentMode, holidayId, promoAppId, statisticsData, price]),
        showPaymentPromo: () => getPromisifiedCallbackMethod(this.oksdk, 'showPaymentPromo'),
        showPortalPayment: (action?: string) => getPromisifiedCallbackMethod(this.oksdk, 'showPortalPayment', action),
        showSendOkPayment: (userId: string, friendId: string, paymentMode: string, price: string, fixed: string, serviceId: string) =>
            this.oksdk.invokeMethod('showSendOkPayment', [userId, friendId, paymentMode, price, fixed, serviceId]),
        showActivePaymentSubscriptions: () => this.oksdk.invokeMethod('showActivePaymentSubscriptions'),
    };

    Layers = {
        joinGroup: (groupId: string, enableMessaging?: boolean) => getPromisifiedCallbackMethod(this.oksdk, 'joinGroup', groupId, enableMessaging),
        openSubApp: (appId: string, customArgs?: string, refPlace?: string, customFrameName?: string) =>
            getPromisifiedCallbackMethod(this.oksdk, 'openSubApp', appId, customArgs, refPlace, customFrameName),
        closeSubApp: () => getPromisifiedCallbackMethod(this.oksdk, 'closeSubApp'),
        postMediatopic: (attachment: Object, status?: boolean, platforms?: string[]) => getPromisifiedCallbackMethod(this.oksdk, 'postMediatopic', attachment, status, platforms),
        showGroupPermissions: (permissions: string, groupId: string) => getPromisifiedCallbackMethod(this.oksdk, 'showGroupPermissions', permissions, groupId),
        showGroupTopic: (topicId: string) => getPromisifiedCallbackMethod(this.oksdk, 'showGroupTopic', topicId),
        showInvite: (text: string, params: string, selectedUids: string) => getPromisifiedCallbackMethod(this.oksdk, 'showInvite', text, params, selectedUids),
        showLoginSuggestion: (gameState: String) => getPromisifiedCallbackMethod(this.oksdk, 'showLoginSuggestion', gameState),
        showNotification: (text: string, params: string, selectedUids: string) => getPromisifiedCallbackMethod(this.oksdk, 'showNotification', text, params, selectedUids),
        showRatingDialog: () => getPromisifiedCallbackMethod(this.oksdk, 'showRatingDialog'),
        showCloseConfirmation: () => this.oksdk.invokeMethod('showCloseConfirmation'),
        showFriendSelectLayer: (paymentMode: string, price: string, fixedPrice: string, sendOk: string, statisticsData: string) =>
            this.oksdk.invokeMethod('showFriendSelectLayer', [paymentMode, fixedPrice, price, sendOk, statisticsData]),
        showPermissions: (permissions: string | string[], uiConf: string) => {
            let localPermissions = permissions;
            if (Array.isArray(permissions)) {
                localPermissions = JSON.stringify(permissions);
            }

            this.oksdk.invokeMethod('showPermissions', [localPermissions, uiConf]);
        },
        avatarDecorationInstalled: (decorationId: string, mainPhotoSet: string) => getPromisifiedCallbackMethod(this.oksdk, 'avatarDecorationInstalled', decorationId, mainPhotoSet),
        successProfileDecorated: (decorationId: string, lottieContent: string, lottieWidthStr: string, lottieHeightStr: string) =>
            getPromisifiedCallbackMethod(this.oksdk, 'successProfileDecorated', decorationId, lottieContent, lottieWidthStr, lottieHeightStr),
        showLogin: (gameState: string) => getPromisifiedCallbackMethod(this.oksdk, 'showLogin', gameState),
        openMessages: (conversationId: string) => this.oksdk.invokeMethod('openMessages', [conversationId]),
        openPhotoPicker: (config: IPhotoPickerConfig) => this.oksdk.invokeMethod('openPhotoPicker', [JSON.stringify(config)]),
        openProfile: (profileId: string) => this.oksdk.invokeMethod('openProfile', [profileId]),
        requestDesktopIcon: () => getPromisifiedCallbackMethod(this.oksdk, 'requestDesktopIcon'),
        showSendPresent: (friendId?: string) => this.oksdk.invokeMethod('showSendPresent', [friendId]),
        showSendPresentFromConstructor: (presentId: string, statisticsData: string) => this.oksdk.invokeMethod('showSendPresentFromConstructor', [presentId, statisticsData]),
        showReshareMenu: (refId1: string, refId2: string, reshareType: string) => this.oksdk.invokeMethod('showReshareMenu', [refId1, refId2, reshareType]),
    };

    Ads = {
        Banner: {
            requestBannerAds: (callback?: ApiCallback) => this.oksdk.invokeMethod('requestBannerAds', undefined, callback),
            showBannerAds: (position?: string, callback?: ApiCallback) => this.oksdk.invokeMethod('showBannerAds', [position], callback),
            hideBannerAds: (callback?: ApiCallback) => this.oksdk.invokeMethod('hideBannerAds', undefined, callback),
            isBannerAdsVisible: (callback?: ApiCallback) => this.oksdk.invokeMethod('isBannerAdsVisible', undefined, callback),
            setBannerFormat: (format: string) => getPromisifiedCallbackMethod(this.oksdk, 'setBannerFormat', format),
            getBannerFormats: () => getPromisifiedCallbackMethod(this.oksdk, 'getBannerFormats'),
        },

        Interstitial: {
            prepareInterstitial: (callback?: ApiCallback) => this.oksdk.invokeMethod('prepareInterstitial', undefined, callback),
            showInterstitial: (callback?: ApiCallback) => this.oksdk.invokeMethod('showInterstitial', undefined, callback),
            showAd: (callback?: ApiCallback) => this.oksdk.invokeMethod('showAd', undefined, callback),
        },

        Rewarded: {
            loadAd: (callback?: ApiCallback) => this.oksdk.invokeMethod('loadAd', undefined, callback),
            prepareMidroll: (callback?: ApiCallback) => this.oksdk.invokeMethod('prepareMidroll', undefined, callback),
            showMidroll: (callback?: ApiCallback) => this.oksdk.invokeMethod('showMidroll', undefined, callback),
            showLoadedAd: (callback?: ApiCallback) => this.oksdk.invokeMethod('showLoadedAd', undefined, callback),
        },

        Mobile: {
            requestNativeAd: (callback?: ApiCallback) => this.oksdk.invokeMethod('requestNativeAd', undefined, callback),
            requestManualAd: (callback?: ApiCallback) => this.oksdk.invokeMethod('requestManualAd', undefined, callback),
            //@ts-ignore
            isNativeAdSupported: () => typeof window.OKApp !== 'undefined' && (typeof window.OKApp as any.isAdsEnabled) !== 'undefined' && window.OKApp.isAdsEnabled(),
        },
    };
}
