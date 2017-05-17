import {Field} from "./Field";
import {Schema} from "./Schema";
import {Database, IQueryOption} from "./Database";
import {Vql} from "./Vql";
import {Condition} from "./Condition";
import {Validator, IValidationErrors} from "./Validator";
import {IDeleteResult, IUpsertResult, IQueryResult} from "./ICRUDResult";

export interface IModelFields {
    [fieldName: string]: Field
}

export interface IModelValues {
    [fieldName: string]: any;
}

export interface IModel {
    new (values?: any): Model;
    schema: Schema;
    database: Database;
}

export abstract class Model {
    private database: Database;
    private schema: Schema;

    constructor(schema: Schema, database: Database) {
        this.schema = schema;
        this.database = database;
    }

    public validate(...fieldNames: Array<string>): IValidationErrors {
        let result = Validator.validate(this.getValues(...fieldNames), this.schema);
        if (!result) return result;
        if (fieldNames.length) {
            let hasError = false;
            let subset: IValidationErrors = {};
            for (let i = 0, il = fieldNames.length; i < il; ++i) {
                let fieldName = fieldNames[i];
                if (!result[fieldName]) continue;
                subset[fieldName] = result[fieldName];
                hasError = true;
            }
            return hasError ? subset : null;
        }
        return result;
    }

    public setValues(values: IModelValues): void {
        if (!values) return;
        let fieldsNames = this.schema.getFieldsNames(),
            fieldName;
        for (let i = fieldsNames.length; i--;) {
            fieldName = fieldsNames[i];
            this[fieldName] = values[fieldName] !== undefined ? values[fieldName] : this[fieldName];
        }
    }

    public getValues<T>(...fields: Array<string>): T {
        let values: T = <T>{},
            fieldsNames = fields.length ? fields : this.schema.getFieldsNames(),
            fieldName;
        for (let i = fieldsNames.length; i--;) {
            fieldName = fieldsNames[i];
            if (this[fieldName] && this[fieldName].getValues) {
                values[fieldName] = this[fieldName].getValues();
            } else {
                values[fieldName] = this[fieldName];
            }
        }
        return values;
    }

    public toJSON<T>(): T {
        return this.getValues<T>();
    }

    public insert<T>(values?: T): Promise<IUpsertResult<T>> {
        if (values) {
            this.setValues(values);
        }
        // removing id for insertion
        // todo: set previous id on failure?
        delete this['id'];
        return (<Database>this['database']).insertOne(this.schema.name, this.getValues());
    }

    public update<T>(values?: T): Promise<IUpsertResult<T>> {
        let modelValues = <T>this.getValues();
        values = values || modelValues;
        values[this.schema.pk] = modelValues[this.schema.pk];
        return (<Database>this['database']).updateOne(this.schema.name, values);
    }

    public delete(): Promise<IDeleteResult> {
        return (<Database>this['database']).deleteOne(this.schema.name, this[this.schema.pk]);
    }

    public increase<T>(field: string, value: number = 1): Promise<IUpsertResult<T>> {
        return (<Database>this['database']).increase(this.schema.name, this[this.schema.pk], field, value);
    }

    public static getDatabase(): Database {
        return <Database>this['database'];
    }

    public static findById<T>(id: number|string, option?: IQueryOption): Promise<IQueryResult<T>> {
        return (<Database>this['database']).findById<T>(this['schema'].name, id, option);
    }

    public static findByModelValues<T>(modelValues: T, option?: IQueryOption): Promise<IQueryResult<T>> {
        return (<Database>this['database']).findByModelValues<T>(this['schema'].name, modelValues, option);
    }

    public static findByQuery<T>(query: Vql): Promise<IQueryResult<T>> {
        return (<Database>this['database']).findByQuery<T>(query);
    }

    public static updateAll<T>(newValues: T, condition: Condition): Promise<IUpsertResult<T>> {
        return (<Database>this['database']).updateAll<T>(this['schema'].name, newValues, condition);
    }

    public static insertAll<T>(values: Array<T>): Promise<IUpsertResult<T>> {
        return (<Database>this['database']).insertAll<T>(this['schema'].name, values);
    }

    public static deleteAll(condition: Condition): Promise<IDeleteResult> {
        return (<Database>this['database']).deleteAll(this['schema'].name, condition);
    }

    public static query<T>(query: string): Promise<T> {
        return (<Database>this['database']).query(query);
    }

    public static count<T>(modelValues: T, option?: IQueryOption): Promise<IQueryResult<T>>;

    public static count<T>(query: Vql): Promise<IQueryResult<T>>;

    public static count<T>(arg1?: T|Vql, option?: IQueryOption): Promise < IQueryResult <number>> {
        if (arg1 instanceof Vql) {
            return this['database'].count(arg1);
        }
        else {
            return this['database'].count(this['schema'].name, arg1, option);
        }
    }

}