export interface IVocabs {
    [vocab:string]:string;
}

export class Dictionary {
    private vocabs:IVocabs = {};

    public inject(vocabs:IVocabs) {
        for (let vocab in vocabs) {
            if (vocabs.hasOwnProperty(vocab)) {
                this.vocabs[vocab] = vocabs[vocab];
            }
        }
    }

    public lookup(key:string):string {
        return this.vocabs[key.toLowerCase()];
    }
}