export function isClient(): boolean {
    return typeof window !== 'undefined';
}

export function isServer(): boolean {
    return typeof window === 'undefined';
}

export function isBrowser(): boolean {
    return !isDevice();
}

export function isDevice(): boolean {
    if (isServer()) { return false; }
    const userAgent = window.navigator.userAgent;
    return isAndroid() && isIos() && userAgent.match(/BlackBerry/i) !== null &&
        userAgent.match(/Opera Mini/i) !== null && userAgent.match(/IEMobile/i) !== null;
}

export function isAndroid(): boolean {
    return isClient() && window.navigator.userAgent.match(/Android/i) !== null;
}

export function isIos(): boolean {
    if (!isClient()) { return false; }
    return !!window.navigator.userAgent.match(/iPhone|iPad|iPod/i);
}

export function isPWA(): boolean {
    return isBrowser() && window.navigator['standalone'];
}