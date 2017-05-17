export class Platform {

    public static Type = {ServerSide: 'server', ClientSide: 'client'};
    public static Platform = {Device: 'device', Browser: 'browser'};
    public static OS = {Windows: 'windows', Linux: 'linux', Android: 'android', IOS: 'ios', BlackBerry: 'bb'};

    private static hasInfo: boolean;
    private static isMobile: boolean;
    private static type: string;
    private static os: string;
    private static platform: string;

    private static getInfo() {
        if (Platform.hasInfo) return;
        Platform.type = typeof window === 'undefined' ? 'server' : 'client';
        if (Platform.type == 'client') {
            if (navigator.userAgent.match(/Android/i)) {
                Platform.isMobile = true;
                Platform.os = Platform.OS.Android;
            } else if (navigator.userAgent.match(/BlackBerry/i)) {
                Platform.isMobile = true;
                Platform.os = Platform.OS.BlackBerry;
            } else if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                Platform.isMobile = true;
                Platform.os = Platform.OS.IOS;
            } else if (navigator.userAgent.match(/Opera Mini/i)) {
                Platform.isMobile = true;
                //Platform.os = Platform.OS.IOS;
            } else if (navigator.userAgent.match(/IEMobile/i)) {
                Platform.isMobile = true;
                //Platform.os = Platform.OS.IOS;
            } else {
                Platform.isMobile = false;
            }
            Platform.platform = Platform.isMobile ? Platform.Platform.Device : Platform.Platform.Browser;

        }
        Platform.hasInfo = true;
    }

    public static isClient(): boolean {
        Platform.getInfo();
        return Platform.type == 'client';
    }

    public static isServer(): boolean {
        Platform.getInfo();
        return Platform.type == 'server';
    }

    public static isBrowser(): boolean {
        Platform.getInfo();
        return Platform.platform == Platform.Platform.Browser;
    }

    public static isDevice(): boolean {
        Platform.getInfo();
        return Platform.isMobile;
    }

    public static isAndroid(): boolean {
        Platform.getInfo();
        return Platform.os == Platform.OS.Android;
    }

    public static isIos(): boolean {
        Platform.getInfo();
        return Platform.os == Platform.OS.IOS;
    }
}