import { Culture } from './Culture';
import { Dictionary } from './Dictionary';


export class Translate {

    public static getInstance(): Translate {
        if (!Translate.instance) {
            Translate.instance = new Translate();
        }
        return Translate.instance;
    }

    private static instance: Translate;
    private dictionary: Dictionary = Culture.getDictionary();

    private constructor() { }

    public translate = (key: string, ...placeholders: Array<any>): string => {
        if (!key) { return ""; }
        let tr = this.dictionary.lookup(key);
        if (!tr) { return key; }
        if (!placeholders.length) { return tr; }
        for (let i = 0, il = placeholders.length; i < il; ++i) {
            tr = tr.replace("%", placeholders[i]);
        }
        return tr;
    }
}
