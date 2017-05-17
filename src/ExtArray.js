export class ExtArray extends Array {
    indexOfByProperty(property, value, fromIndex = 0) {
        for (let i = fromIndex, il = this.length; i < il; ++i) {
            if (this[i][property] == value) {
                return i;
            }
        }
        return -1;
    }
    findByProperty(property, value) {
        let founds = new ExtArray(), i, il;
        if (value.splice) {
            for (i = 0, il = this.length; i < il; ++i) {
                for (let j = 0, jl = value.length; j < jl; ++j) {
                    if (this[i][property] == value[j]) {
                        founds.push(this[i]);
                    }
                }
            }
        }
        else {
            for (i = 0, il = this.length; i < il; ++i) {
                if (this[i][property] == value) {
                    founds.push(this[i]);
                }
            }
        }
        return founds;
    }
    removeByProperty(property, value) {
        let index = this.indexOfByProperty(property, value);
        return index >= 0 ? this.splice(index, 1) : undefined;
    }
    set(items) {
        this.splice(0, this.length);
        for (let i = 0, il = items.length; i < il; ++i) {
            this.push(items[i]);
        }
    }
    clear() {
        this.splice(0, this.length);
    }
}
