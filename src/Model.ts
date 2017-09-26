import {Field} from "./Field";
import {Schema} from "./Schema";
import {Database, IQueryOption, Transaction} from "./Database";
import {Vql} from "./Vql";
import {Condition} from "./Condition";
import {IValidationError, Validator} from "./Validator";
import {IDeleteResult, IQueryResult, IUpsertResult} from "./ICRUDResult";

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
    public static schema: Schema;
    public static database: Database;

    constructor(schema: Schema, database: Database) {
        this.schema = schema;
        this.database = database;
    }

    public validate(...fieldNames: Array<string>): IValidationError {
        let result = Validator.validate(this.getValues(...fieldNames), this.schema);
        if (!result) return null;
        if (fieldNames.length) {
            let hasError = false;
            let subset: IValidationError = {};
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

    public insert<T>(values?: T, transaction?: Transaction): Promise<IUpsertResult<T>> {
        if (values) {
            this.setValues(values);
        }
        return (this.database).insert(this.schema.name, this.getValues(), transaction);
    }

    public update<T>(values?: T, transaction?: Transaction): Promise<IUpsertResult<T>> {
        let modelValues = <T>this.getValues();
        values = values || modelValues;
        values[this.schema.pk] = modelValues[this.schema.pk];
        return (this.database).update(this.schema.name, values, transaction);
    }

    public remove(transaction?: Transaction): Promise<IDeleteResult> {
        return (this.database).remove(this.schema.name, this[this.schema.pk], transaction);
    }

    public increase<T>(field: string, value: number = 1, transaction?: Transaction): Promise<IUpsertResult<T>> {
        return (this.database).increase(this.schema.name, this[this.schema.pk], field, value, transaction);
    }

    public static getDatabase(): Database {
        return this.database;
    }

    public static find<T>(query: Vql, transaction?: Transaction): Promise<IQueryResult<T>>
    public static find<T>(id: number | string, option?: IQueryOption, transaction?: Transaction): Promise<IQueryResult<T>>
    public static find<T>(modelValues: T, option?: IQueryOption, transaction?: Transaction): Promise<IQueryResult<T>>
    public static find<T>(arg1: number | string | T | Vql, arg2?: IQueryOption | Transaction, transaction?: Transaction): Promise<IQueryResult<T>> {
        if (arg1 instanceof Vql) {
            return (this.database).find<T>(<Vql>arg1, transaction);
        } else {
            return (this.database).find<T>(this.schema.name, <any>arg1, <IQueryOption>arg2, transaction);
        }

    }

    public static update<T>(value: T, transaction?: Transaction): Promise<IUpsertResult<T>>
    public static update<T>(newValues: T, condition: Condition, transaction?: Transaction): Promise<IUpsertResult<T>>
    public static update<T>(value: T, arg2: Condition | Transaction, transaction?: Transaction): Promise<IUpsertResult<T>> {
        if (arg2 instanceof Condition) {
            return this.database.update(this.schema.name, value, <Condition>arg2, transaction)
        } else {
            return this.database.update(this.schema.name, value, <Transaction>arg2)
        }
    }

    public static insert<T>(values?: T, transaction?: Transaction): Promise<IUpsertResult<T>>
    public static insert<T>(values: Array<T>, transaction?: Transaction): Promise<IUpsertResult<T>>
    public static insert<T>(values: Array<T>, transaction?: Transaction): Promise<IUpsertResult<T>> {
        return (this.database).insert(this.schema.name, <any>values, transaction);
    }

    public static remove(id: number | string, transaction?: Transaction): Promise<IDeleteResult>
    public static remove(condition: Condition, transaction?: Transaction): Promise<IDeleteResult>
    public static remove(arg1: Condition | number | string, transaction?: Transaction): Promise<IDeleteResult> {
        return (this.database).remove(this.schema.name, <any>arg1, transaction);

    }

    public static query<T>(query: string, transaction?: Transaction): Promise<T> {
        return (this.database).query(query, null, transaction);
    }

    public static count<T>(modelValues: T, option?: IQueryOption, transaction?: Transaction): Promise<IQueryResult<T>>
    public static count<T>(query: Vql, transaction?: Transaction): Promise<IQueryResult<T>>
    public static count<T>(arg1?: T | Vql, arg2?: IQueryOption | Transaction, transaction?: Transaction): Promise<IQueryResult<T>> {
        if (arg1 instanceof Vql) {
            return this.database.count(arg1, <Transaction>arg2);
        }
        else {
            return this.database.count(this.schema.name, arg1, <IQueryOption>arg2, transaction);
        }
    }

}