import {IRole, Role, Status} from "./Role";
import {Model, IModelValues} from "../../src/Model";
import {Schema} from "../../src/Schema";
import {Database} from "../../src/Database";
import {FieldType} from "../../src/Field";

export interface IRoleGroup {
    id?: number;
    name: string;
    desc?: string;
    roles?: Array<number | IRole | Role>;
    status?: Status;
}


export class RoleGroup extends Model implements IRoleGroup {
    public static schema: Schema = new Schema('RoleGroup');
    public static database: Database;
    public id: number;
    public name: string;
    public desc: string;
    public roles: Array<number | IRole | Role> = [];
    public status: Status = Status.Active;

    constructor(values?: IModelValues) {
        super(RoleGroup.schema, RoleGroup.database);
        this.setValues(values);
    }
}

RoleGroup.schema.addField('id').type(FieldType.Integer).primary();
RoleGroup.schema.addField('name').type(FieldType.String).required().unique();
RoleGroup.schema.addField('desc').type(FieldType.Text);
RoleGroup.schema.addField('roles').type(FieldType.Relation).areManyOf(Role);
RoleGroup.schema.addField('status').type(FieldType.Enum).enum(Status.Active, Status.Inactive).required();
RoleGroup.schema.freeze();