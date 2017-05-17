import {IRoleGroup, RoleGroup} from "./RoleGroup";
import {Model, IModelValues} from "../../src/lib/Model";
import {Schema} from "../../src/lib/Schema";
import {Database} from "../../src/lib/Database";
import {FieldType} from "../../src/lib/Field";

export const enum UserGender {Male = 1, Female}

export interface IUser {
    id?: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    birthDate?: number;
    gender?: UserGender;
    image?: File | string;
    roleGroups?: Array<number | IRoleGroup | RoleGroup>;
}

export class User extends Model implements IUser {
    public static schema: Schema = new Schema('User');
    public static database: Database;
    public id: number;
    public username: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public birthDate: number;
    public gender: UserGender;
    public image: File | string;
    public roleGroups: Array<number | IRoleGroup | RoleGroup> = [];

    constructor(values?: IModelValues) {
        super(User.schema, User.database);
        this.setValues(values);
    }

}

User.schema.addField('id').type(FieldType.String).primary();
User.schema.addField('username').type(FieldType.String).unique().required().minLength(4).maxLength(16);
User.schema.addField('firstName').type(FieldType.String).minLength(2);
User.schema.addField('lastName').type(FieldType.String).minLength(2);
User.schema.addField('email').type(FieldType.EMail).unique();
User.schema.addField('password').type(FieldType.Password).required().minLength(4).assert((password: string) => password.length < 16);
User.schema.addField('birthDate').type(FieldType.Timestamp);
User.schema.addField('gender').type(FieldType.Enum).enum(UserGender.Male, UserGender.Female).default(UserGender.Male);
User.schema.addField('image').type(FieldType.File).maxSize(6144).fileType('image/png', 'image/jpeg', 'image/pjpeg');
User.schema.addField('roleGroups').type(FieldType.Relation).areManyOf(RoleGroup);
User.schema.freeze();