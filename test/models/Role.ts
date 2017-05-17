import {IPermission, Permission} from "./Permission";
import {Model, IModelValues} from "../../src/Model";
import {Schema} from "../../src/Schema";
import {Database} from "../../src/Database";
import {FieldType} from "../../src/Field";
export const enum Status{Inactive = 0, Active = 1}

export interface IRole {
    id?: number;
    name?: string;
    desc?: string;
    permissions?: Array<number | IPermission | Permission>;
    status?: Status;
}

export class Role extends Model implements IRole {
    public static schema: Schema = new Schema('Role');
    public static database: Database;
    public id: number;
    public name: string;
    public desc: string;
    public permissions: Array<number | IPermission | Permission> = [];
    public status: Status = Status.Active;

    constructor(values?: IModelValues) {
        super(Role.schema, Role.database);
        this.setValues(values);
    }
}

Role.schema.addField('id').type(FieldType.Integer).primary();
Role.schema.addField('name').type(FieldType.String).required().unique();
Role.schema.addField('desc').type(FieldType.Text);
Role.schema.addField('permissions').type(FieldType.Relation).areManyOf(Permission);
Role.schema.addField('status').type(FieldType.Enum).enum(Status.Active, Status.Inactive).required();
Role.schema.freeze();