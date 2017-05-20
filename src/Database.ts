import {Schema} from "./Schema";
import {IModel} from "./Model";
import {Vql} from "./Vql";
import {Condition} from "./Condition";
import {IDeleteResult, IUpsertResult, IQueryResult} from "./ICRUDResult";

/**
 * protocol     database protocol (Database.MySQL | Database.Redis | ...)
 * host         database server IP address or hostName
 * port         port number on database server
 * user         username for connecting to database server
 * password     password for connecting to database server
 * database     name of the database or collection
 */
export interface IDatabaseConfig {
    protocol: string;
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}

/**
 * field        name of field
 * ascending    sort ascending if true, otherwise sort descending
 */
export interface IOrderBy {
    field: string;
    ascending: boolean;
}

/**
 * limit        number of records that should be fetched
 * offset       offset of starting record index (LIMIT fetchFrom, fetchLimit)
 * page         offset = (page - 1) * limit
 * fields       fieldNames that are suppose to be fetched
 * sort         sort results by fieldName and type of sorting (ORDER BY fieldName ASC | DESC)
 * relations    fieldNames (of type Relationship) that their related models should be fetched
 */
export interface IQueryOption {
    limit?: number;
    offset?: number;
    page?: number;
    fields?: Array<string | Vql>;
    orderBy?: Array<IOrderBy>;
    relations?: Array<{ name: string, fields: Array<string> } | string>;
}

export interface IModelCollection {
    [name: string]: IModel
}

export interface ISchemaList {
    [name: string]: Schema
}


export interface IDatabase {
    new (config: IDatabaseConfig, models: IModelCollection): Database;
}

export interface IKeyValueDatabase {
    new (config: IDatabaseConfig): KeyValueDatabase;
}
/**
 * Database interface for key-value databases.
 */
export interface KeyValueDatabase {

    connect(): Promise<KeyValueDatabase>;

    close(connection: any): Promise<boolean>;

    find<T>(key: string): Promise<IQueryResult<T>>;

    insert<T>(key: string, value: T): Promise<IUpsertResult<T>>;

    update<T>(key: string, value: T): Promise<IUpsertResult<T>>;

    remove(key: string): Promise<IDeleteResult>;
}

/**
 * Database interface for non key-value databases.
 */
export interface Database {

    connect(): Promise<Database>;

    find<T>(model: string, id: number | string, option?: IQueryOption, transaction?: Transaction): Promise<IQueryResult<T>>;

    find<T>(model: string, modelValues: T, option?: IQueryOption, transaction?: Transaction): Promise<IQueryResult<T>>;

    find<T>(query: Vql, transaction?: Transaction): Promise<IQueryResult<T>>;

    insert<T>(model: string, value: T, transaction?: Transaction): Promise<IUpsertResult<T>>;

    insert<T>(model: string, values: Array<T>, transaction?: Transaction): Promise<IUpsertResult<T>>;

    update<T>(model: string, value: T, transaction?: Transaction): Promise<IUpsertResult<T>>;

    update<T>(model: string, newValues: T, condition: Condition, transaction?: Transaction): Promise<IUpsertResult<T>>;

    remove(model: string, id: number | string, transaction?: Transaction): Promise<IDeleteResult>;

    remove(model: string, condition: Condition, transaction?: Transaction): Promise<IDeleteResult>;

    init();

    query<T>(query: string, data?: Array<number | string | Array<number | string>>, transaction?: Transaction): Promise<T>;

    close(connection: any): Promise<boolean>;

    count<T>(model: string, modelValues: T, option?: IQueryOption, transaction?: Transaction): Promise<IQueryResult<T>>;

    count<T>(query: Vql, transaction?: Transaction): Promise<IQueryResult<T>>;

    increase<T>(model: string, id: number | string, field: string, value: number, transaction?: Transaction): Promise<IQueryResult<T>>;
}


/**
 * Transaction Class for handling database transactions
 */

export class Transaction {
    private _connection: any;
    public commit: () => Promise<any> = () => Promise.reject(new Error('transaction connection not set'));
    public rollback: () => Promise<any> = () => Promise.reject(new Error('transaction connection not set'));

    public set connection(connection: any) {
        this._connection = this._connection || connection;
    }

    public get connection() {
        return this._connection
    }
}