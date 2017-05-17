export class Field {
    constructor(fieldName) {
        this._properties = {};
        this._fieldName = fieldName;
        this._properties.enum = [];
        this._properties.fileType = [];
    }
    get fieldName() {
        return this._fieldName;
    }
    get properties() {
        return this._properties;
    }
    required() {
        this._properties.required = true;
        return this;
    }
    type(type) {
        this._properties.type = type;
        return this;
    }
    listOf(type) {
        this._properties.list = type;
        return this;
    }
    pattern(pattern) {
        this._properties.pattern = pattern;
        return this;
    }
    minLength(minLength) {
        this._properties.minLength = +minLength;
        return this;
    }
    maxLength(maxLength) {
        this._properties.maxLength = +maxLength;
        return this;
    }
    min(min) {
        this._properties.min = +min;
        return this;
    }
    max(max) {
        this._properties.max = +max;
        return this;
    }
    assert(cb) {
        this._properties.assert = cb;
        return this;
    }
    enum(...values) {
        this._properties.enum = values;
        return this;
    }
    default(value) {
        this._properties.default = value;
        return this;
    }
    unique(isUnique = true) {
        this._properties.unique = isUnique;
        return this;
    }
    primary(isPrimary = true) {
        this._properties.primary = isPrimary;
        return this;
    }
    maxSize(sizeInKB) {
        this._properties.maxSize = sizeInKB;
        return this;
    }
    fileType(...fileTypes) {
        this._properties.fileType = fileTypes;
        return this;
    }
    multilingual() {
        this._properties.multilingual = true;
        return this;
    }
    setRelation(type, model) {
        this._properties.relation = { type, model };
        return this;
    }
    /**
     *  for one to one relationship
     */
    isPartOf(model) {
        return this.setRelation(1 /* One2One */, model);
    }
    /**
     *  for one to many relationship
     */
    isOneOf(model) {
        return this.setRelation(2 /* One2Many */, model);
    }
    /**
     *  for many to many relationship
     */
    areManyOf(model) {
        return this.setRelation(3 /* Many2Many */, model);
    }
    /**
     *  for many to many relationship
     */
    areReverseOf(model) {
        return this.setRelation(4 /* Reverse */, model);
    }
    isWeek() {
        this._properties.relation.isWeek = true;
        return this;
    }
}
