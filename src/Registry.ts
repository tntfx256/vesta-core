export class Registry {

    public static set<T>(key: string, value: T) {
        Registry.storage[key] = value;
    }

    public static get<T>(key: string, defaultValue?: T) {
        if (key in Registry.storage) {
            return Registry.storage[key];
        }
        return defaultValue || null;
    }

    private static storage: any = {};

    private constructor() { }
}