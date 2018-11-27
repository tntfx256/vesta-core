export interface IVocabs {
    [vocab: string]: string;
}

export class Dictionary {
    private vocabs: IVocabs = {};

    public inject(vocabs: IVocabs) {
        for (let keys = Object.keys(vocabs), i = 0, il = keys.length; i < il; i++) {
            this.vocabs[keys[i]] = vocabs[keys[i]];
        }
    }

    public lookup(key: string): string {
        return this.vocabs[key.toLowerCase()];
    }

    public translate = (key: string, ...placeholders: Array<any>): string => {
        if (!key) { return ""; }
        let tr = this.lookup(key);
        if (!tr) { return key; }
        if (!placeholders.length) { return tr; }
        for (let i = 0, il = placeholders.length; i < il; ++i) {
            tr = tr.replace("%", placeholders[i]);
        }
        return tr;
    }
}
