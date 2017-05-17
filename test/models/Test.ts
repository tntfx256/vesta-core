import {IPermission, Permission} from "./Permission";
import {Model, IModelValues} from "../../src/lib/Model";
import {Schema} from "../../src/lib/Schema";
import {Database} from "../../src/lib/Database";
import {FieldType} from "../../src/lib/Field";

export interface ITest {
    id?: number;
    emails: Array<string>;
    permissions: Array<number | IPermission | Permission>;
    images: Array<File | string>;
}

export class Test extends Model implements ITest {
    public static schema: Schema = new Schema('TestUser');
    public static database: Database;
    public id: number;
    public emails: Array<string> = [];
    public permissions: Array<number | IPermission | Permission> = [];
    public images: Array<File | string> = [];

    constructor(values?: IModelValues) {
        super(Test.schema, Test.database);
        this.setValues(values);
    }
}

Test.schema.addField('id').type(FieldType.String).primary();
Test.schema.addField('emails').type(FieldType.List).listOf(FieldType.EMail).required();
Test.schema.addField('permissions').type(FieldType.Relation).areManyOf(Permission).required();
Test.schema.addField('images').type(FieldType.List).listOf(FieldType.File).maxSize(6144).fileType('image/png', 'image/jpeg', 'image/pjpeg');
Test.schema.freeze();