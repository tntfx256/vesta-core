export class ExtArray<T> extends Array {

    public indexOfByProperty(property: string, value: any, fromIndex: number = 0): number {
        for (let i = fromIndex, il = this.length; i < il; ++i) {
            if (this[i][property] == value) {
                return i;
            }
        }
        return -1;
    }

    public findByProperty(property: string, value: any): ExtArray<T>;
    public findByProperty(property: string, value: Array<any>): ExtArray<T> {
        let founds = new ExtArray<T>(), i, il;
        if (value.splice) {
            for (i = 0, il = this.length; i < il; ++i) {
                for (let j = 0, jl = value.length; j < jl; ++j) {
                    if (this[i][property] == value[j]) {
                        founds.push(this[i]);
                    }
                }
            }
        } else {
            for (i = 0, il = this.length; i < il; ++i) {
                if (this[i][property] == value) {
                    founds.push(this[i]);
                }
            }
        }
        return founds;
    }

    public removeByProperty(property: string, value) {
        let index = this.indexOfByProperty(property, value);
        return index >= 0 ? this.splice(index, 1) : undefined;
    }

    public set(items: Array<T>) {
        this.splice(0, this.length);
        for (let i = 0, il = items.length; i < il; ++i) {
            this.push(items[i]);
        }
    }

    public clear() {
        this.splice(0, this.length);
    }

}
