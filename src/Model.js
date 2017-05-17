import { Vql } from "./Vql";
import { Validator } from "./Validator";
export class Model {
    constructor(schema, database) {
        this.schema = schema;
        this.database = database;
    }
    validate(...fieldNames) {
        let result = Validator.validate(this.getValues(...fieldNames), this.schema);
        if (!result)
            return result;
        if (fieldNames.length) {
            let hasError = false;
            let subset = {};
            for (let i = 0, il = fieldNames.length; i < il; ++i) {
                let fieldName = fieldNames[i];
                if (!result[fieldName])
                    continue;
                subset[fieldName] = result[fieldName];
                hasError = true;
            }
            return hasError ? subset : null;
        }
        return result;
    }
    setValues(values) {
        if (!values)
            return;
        let fieldsNames = this.schema.getFieldsNames(), fieldName;
        for (let i = fieldsNames.length; i--;) {
            fieldName = fieldsNames[i];
            this[fieldName] = values[fieldName] !== undefined ? values[fieldName] : this[fieldName];
        }
    }
    getValues(...fields) {
        let values = {}, fieldsNames = fields.length ? fields : this.schema.getFieldsNames(), fieldName;
        for (let i = fieldsNames.length; i--;) {
            fieldName = fieldsNames[i];
            if (this[fieldName] && this[fieldName].getValues) {
                values[fieldName] = this[fieldName].getValues();
            }
            else {
                values[fieldName] = this[fieldName];
            }
        }
        return values;
    }
    toJSON() {
        return this.getValues();
    }
    insert(values) {
        if (values) {
            this.setValues(values);
        }
        // removing id for insertion
        // todo: set previous id on failure?
        delete this['id'];
        return this['database'].insertOne(this.schema.name, this.getValues());
    }
    update(values) {
        let modelValues = this.getValues();
        values = values || modelValues;
        values[this.schema.pk] = modelValues[this.schema.pk];
        return this['database'].updateOne(this.schema.name, values);
    }
    delete() {
        return this['database'].deleteOne(this.schema.name, this[this.schema.pk]);
    }
    increase(field, value = 1) {
        return this['database'].increase(this.schema.name, this[this.schema.pk], field, value);
    }
    static getDatabase() {
        return this['database'];
    }
    static findById(id, option) {
        return this['database'].findById(this['schema'].name, id, option);
    }
    static findByModelValues(modelValues, option) {
        return this['database'].findByModelValues(this['schema'].name, modelValues, option);
    }
    static findByQuery(query) {
        return this['database'].findByQuery(query);
    }
    static updateAll(newValues, condition) {
        return this['database'].updateAll(this['schema'].name, newValues, condition);
    }
    static insertAll(values) {
        return this['database'].insertAll(this['schema'].name, values);
    }
    static deleteAll(condition) {
        return this['database'].deleteAll(this['schema'].name, condition);
    }
    static query(query) {
        return this['database'].query(query);
    }
    static count(arg1, option) {
        if (arg1 instanceof Vql) {
            return this['database'].count(arg1);
        }
        else {
            return this['database'].count(this['schema'].name, arg1, option);
        }
    }
}
