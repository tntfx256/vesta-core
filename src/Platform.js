export class Platform {
    static getInfo() {
        if (Platform.hasInfo)
            return;
        Platform.type = typeof window === 'undefined' ? 'server' : 'client';
        if (Platform.type == 'client') {
            if (navigator.userAgent.match(/Android/i)) {
                Platform.isMobile = true;
                Platform.os = Platform.OS.Android;
            }
            else if (navigator.userAgent.match(/BlackBerry/i)) {
                Platform.isMobile = true;
                Platform.os = Platform.OS.BlackBerry;
            }
            else if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                Platform.isMobile = true;
                Platform.os = Platform.OS.IOS;
            }
            else if (navigator.userAgent.match(/Opera Mini/i)) {
                Platform.isMobile = true;
                //Platform.os = Platform.OS.IOS;
            }
            else if (navigator.userAgent.match(/IEMobile/i)) {
                Platform.isMobile = true;
                //Platform.os = Platform.OS.IOS;
            }
            else {
                Platform.isMobile = false;
            }
            Platform.platform = Platform.isMobile ? Platform.Platform.Device : Platform.Platform.Browser;
        }
        Platform.hasInfo = true;
    }
    static isClient() {
        Platform.getInfo();
        return Platform.type == 'client';
    }
    static isServer() {
        Platform.getInfo();
        return Platform.type == 'server';
    }
    static isBrowser() {
        Platform.getInfo();
        return Platform.platform == Platform.Platform.Browser;
    }
    static isDevice() {
        Platform.getInfo();
        return Platform.isMobile;
    }
    static isAndroid() {
        Platform.getInfo();
        return Platform.os == Platform.OS.Android;
    }
    static isIos() {
        Platform.getInfo();
        return Platform.os == Platform.OS.IOS;
    }
}
Platform.Type = { ServerSide: 'server', ClientSide: 'client' };
Platform.Platform = { Device: 'device', Browser: 'browser' };
Platform.OS = { Windows: 'windows', Linux: 'linux', Android: 'android', IOS: 'ios', BlackBerry: 'bb' };
