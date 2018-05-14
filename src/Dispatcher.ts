export type IDispatcherCallBack<T> = (payload: T) => boolean | void;

interface IDispatcherRegistry<T> {
    [eventName: string]: Array<IDispatcherCallBack<T>>;
}

export class Dispatcher {

    public static getInstance(name: string = "main"): Dispatcher {
        if (!Dispatcher.instances[name]) {
            Dispatcher.instances[name] = new Dispatcher(name);
        }
        return Dispatcher.instances[name];
    }

    private static instances: Array<Dispatcher> = [];
    private registry: IDispatcherRegistry<any> = {};

    constructor(name: string) {
        Dispatcher.instances[name] = this;
    }

    public register<T>(eventName: string, callback: IDispatcherCallBack<T>) {
        if (!this.registry[eventName]) {
            this.registry[eventName] = [];
        }
        this.registry[eventName].push(callback);
    }

    public unregister(eventName: string, callback: any): boolean {
        if (!this.registry[eventName]) {
            return true;
        }
        for (let i = this.registry[eventName].length; i--;) {
            if (this.registry[eventName][i] == callback) {
                this.registry[eventName].splice(i, 1);
                break;
            }
        }
        return true;
    }

    public dispatch = <T>(eventName: string, payload: T) => {
        if (!this.registry[eventName]) {
            return;
        }
        for (let i = 0, il = this.registry[eventName].length; i < il; ++i) {
            this.registry[eventName][i](payload);
        }
    }
}
