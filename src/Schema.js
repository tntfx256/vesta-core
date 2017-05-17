import { Field } from "./Field";
export class Schema {
    constructor(modelName) {
        this.modelName = modelName;
        this.fields = {};
        this.fieldsName = [];
    }
    get name() {
        return this.modelName;
    }
    get validateSchema() {
        if (!this._validateSchema) {
            this._validateSchema = getValidatorSchema(this.fields);
        }
        return this._validateSchema;
    }
    getFields() {
        return this.fields;
    }
    getFieldsNames() {
        return this.fieldsName;
    }
    addField(fieldName) {
        this.fields = this.fields || {};
        this.fields[fieldName] = new Field(fieldName);
        this.fieldsName.push(fieldName);
        return this.fields[fieldName];
    }
    getField(fieldName) {
        return this.fields[fieldName];
    }
    setPrimaryKey() {
        let fields = this.getFields();
        let pk = 'id';
        for (let i = 0, keys = Object.keys(fields), il = keys.length; i < il; i++) {
            if (fields[keys[i]].properties.primary) {
                pk = keys[i];
                break;
            }
        }
        this.pk = pk;
    }
    freeze() {
        this._validateSchema = getValidatorSchema(this.fields);
        this.setPrimaryKey();
        this.freezeObject(this);
    }
    freezeObject(object) {
        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                if (typeof object[key] == 'object') {
                    this.freezeObject(object[key]);
                }
            }
        }
        Object.freeze(object);
    }
}
/**
 *
 * @param {IModelFields} fields  {fieldName: Field}
 * @returns {IValidationModelSet}
 */
function getValidatorSchema(fields) {
    let getFieldSchema = function (properties) {
        let fieldSchema = {};
        for (let property in properties) {
            if (properties.hasOwnProperty(property)) {
                if (['fileType', 'enum'].indexOf(property) >= 0) {
                    if (!properties[property].length)
                        continue;
                }
                fieldSchema[property] = properties[property];
            }
        }
        return fieldSchema;
    };
    let schema = {};
    for (let field in fields) {
        if (fields.hasOwnProperty(field)) {
            schema[field] = getFieldSchema(fields[field].properties);
        }
    }
    return schema;
}
