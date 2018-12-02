import { Database } from "../../src/Database";
import { FieldType } from "../../src/Field";
import { Model } from "../../src/Model";
import { Schema } from "../../src/Schema";


export interface ITest {
    id?: number;
    emails: Array<string>;
    images: Array<File | string>;
}

export class Test extends Model implements ITest {
    public static schema: Schema = new Schema('TestUser');
    public static database: Database;
    public id: number;
    public emails: Array<string> = [];
    public images: Array<File | string> = [];

    constructor(values?: IModelValues) {
        super(Test.schema, Test.database);
        this.setValues(values);
    }
}

Test.schema.addField('id').type(FieldType.String).primary();
Test.schema.addField('emails').type(FieldType.List).listOf(FieldType.EMail).required();
Test.schema.addField('images').type(FieldType.List).listOf(FieldType.File).maxSize(6144).fileType('image/png', 'image/jpeg', 'image/pjpeg');
Test.schema.freeze();