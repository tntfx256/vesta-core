export class Dictionary {
    constructor() {
        this.vocabs = {};
    }
    inject(vocabs) {
        for (let vocab in vocabs) {
            if (vocabs.hasOwnProperty(vocab)) {
                this.vocabs[vocab] = vocabs[vocab];
            }
        }
    }
    lookup(key) {
        return this.vocabs[key.toLowerCase()];
    }
}
