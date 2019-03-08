export class Registry {

    public static getPrivateStorage(key: string) {
        if (!(key in Registry.privateStorage)) {
            Registry.privateStorage[key] = {};
        }

        return {
            set: function <T>(key: string, value: T): void {
                Registry.privateStorage[key] = value;
            },
            get: function <T>(key: string, defaultValue?: T): T | null {
                if (key in Registry.storage) {
                    return Registry.storage[key];
                }
                return defaultValue || null;
            }
        }
    }

    public static set<T>(key: string, value: T): void {
        Registry.storage[key] = value;
    }

    public static get<T>(key: string, defaultValue?: T): T | null {
        if (key in Registry.storage) {
            return Registry.storage[key];
        }
        return defaultValue || null;
    }

    private static storage: any = {};
    private static privateStorage: any = {};

    private constructor() { }
}