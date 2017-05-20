import {IValidationModelSet, IValidationModel} from "./Validator";
import {Field, IFieldProperties} from "./Field";
import {IModelFields} from "./Model";

export class Schema {
    private _validateSchema;
    private fields: IModelFields = {};
    private fieldsName: Array<string> = [];
    public pk;

    constructor(private modelName: string) {
    }

    get name(): string {
        return this.modelName;
    }

    get validateSchema() {
        if (!this._validateSchema) {
            this._validateSchema = getValidatorSchema(this.fields);
        }
        return this._validateSchema;
    }

    public getFields(): IModelFields {
        return this.fields;
    }

    public getFieldsNames(): Array<string> {
        return this.fieldsName;
    }

    public addField(fieldName: string): Field {
        this.fields = this.fields || {};
        this.fields[fieldName] = new Field(fieldName);
        this.fieldsName.push(fieldName);
        return this.fields[fieldName];
    }

    public getField(fieldName: string): Field {
        return this.fields[fieldName];
    }

    private setPrimaryKey() {
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

    public freeze() {
        this._validateSchema = getValidatorSchema(this.fields);
        this.setPrimaryKey();
        this.freezeObject(this);
    }

    private freezeObject(object) {
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
function getValidatorSchema(fields: IModelFields): IValidationModelSet {

    let getFieldSchema = function (properties: IFieldProperties): IValidationModel {
        let fieldSchema = {};
        for (let property in properties) {
            if (properties.hasOwnProperty(property)) {
                if (['fileType', 'enum'].indexOf(property) >= 0) {
                    if (!properties[property].length) continue;
                }
                fieldSchema[property] = properties[property];
            }
        }
        return fieldSchema;
    };

    let schema: IValidationModelSet = {};
    for (let field in fields) {
        if (fields.hasOwnProperty(field)) {
            schema[field] = getFieldSchema(fields[field].properties);
        }
    }
    return schema;
}
