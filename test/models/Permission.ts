import {Model, IModelValues} from "../../src/lib/Model";
import {Schema} from "../../src/lib/Schema";
import {Database} from "../../src/lib/Database";
import {FieldType} from "../../src/lib/Field";
export interface IPermissionAction {
    Read: string;
    Add: string;
    Edit: string;
    Delete: string;
}

export interface IPermission {
    id?: number;
    resource?: string;
    action?: string;
    status?: boolean;
}

export class Permission extends Model implements IPermission {
    public static schema: Schema = new Schema('Permission');
    public static database: Database;
    public static Action: IPermissionAction = {Read: 'read', Add: 'add', Edit: 'edit', Delete: 'del'};
    public id: number;
    public resource: string;
    public action: string;
    public status: boolean = true;

    constructor(values?: IModelValues) {
        super(Permission.schema, Permission.database);
        this.setValues(values);
    }
}

Permission.schema.addField('id').type(FieldType.Integer).primary();
Permission.schema.addField('resource').type(FieldType.String).required();
Permission.schema.addField('action').type(FieldType.String).required();
Permission.schema.addField('status').type(FieldType.Boolean).default(true).required();
Permission.schema.freeze();
