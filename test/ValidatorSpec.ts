import {Validator} from "../Validator";
import {User} from "./model/User";
import {Field} from "../Field";
import {Test, ITest} from "./model/Test";
import {Permission} from ".//model/Permission";

describe("Testing Validator.ruleValidator", function () {

    it("required", function () {
        let validValues = ['test', false, {}, []],
            invalidValues = [null, '', undefined];

        validValues.forEach(value=> expect(Validator.ruleValidator.required(value, true)).toBe(true));
        validValues.forEach(value=> expect(Validator.ruleValidator.required(value, false)).toBe(true));
        invalidValues.forEach(value=> expect(Validator.ruleValidator.required(value, true)).toBe(false));
        invalidValues.forEach(value=> expect(Validator.ruleValidator.required(value, false)).toBe(true));
    });

    it("minLength", function () {
        let validValues = ['abcd', 'abcdef'],
            invalidValues = [null, undefined, '', 'ab'];

        validValues.forEach(value=> expect(Validator.ruleValidator.minLength(value, 4)).toBe(true));
        invalidValues.forEach(value=> expect(Validator.ruleValidator.minLength(value, 4)).toBe(false));
    });

    it("maxLength", function () {
        let validValues = ['', 'ab', 'abcd'],
            invalidValues = [null, undefined, 'abcdef'];

        validValues.forEach(value=> expect(Validator.ruleValidator.maxLength(value, 4)).toBe(true));
        invalidValues.forEach(value=> expect(Validator.ruleValidator.maxLength(value, 4)).toBe(false));
    });

    it("pattern", function () {
        expect(Validator.ruleValidator.pattern('abCdef', /^[a-z]+$/i)).toBe(true);
        expect(Validator.ruleValidator.pattern('abC34def', /^[a-z]+$/)).toBe(false);
    });

    it("min", function () {
        let validValues = [4, 100],
            invalidValues = [NaN, null, undefined, 3, 0, -1];

        validValues.forEach(value=> expect(Validator.ruleValidator.min(value, 4)).toBe(true));
        invalidValues.forEach(value=> expect(Validator.ruleValidator.min(value, 4)).toBe(false));
    });

    it("max", function () {
        let validValues = [4, -100, 0],
            invalidValues = [NaN, null, undefined, 5, 100];

        validValues.forEach(value=> expect(Validator.ruleValidator.max(value, 4)).toBe(true));
        invalidValues.forEach(value=> expect(Validator.ruleValidator.max(value, 4)).toBe(false));
    });

    it("asset", function () {
        let allValues = {a: 1, b: 2};

        expect(Validator.ruleValidator.assert(2, (value, field, allValues)=> value == allValues['a'], <Field>{}, allValues)).toBe(false);
        expect(Validator.ruleValidator.assert(2, (value, field, allValues)=> value == allValues['b'], <Field>{}, allValues)).toBe(true);
    });

    it("maxSize", function () {
        let validValues = [<File>{size: 1024 * 1024}],
            invalidValues = [null, undefined, <File>{size: 1025 * 1024}];

        validValues.forEach(value=> expect(Validator.ruleValidator.maxSize(value, 1024)).toBe(true));
        invalidValues.forEach(value=> expect(Validator.ruleValidator.maxSize(value, 1024)).toBe(false));
    });

    it("fileType", function () {
        let validValues = [
                <File>{name: 'test.jpg.pdf'},
                <File>{name: 'test.jpg.pdf', type: 'application/pdf'},
                <File>{name: 'test.pdf', type: 'application/octet-stream'}
            ],
            invalidValues = [null, undefined,
                <File>{name: 'test.pdf', type: 'application/pdf'},
                <File>{name: 'test', type: 'application/octet-stream'},
                <File>{name: 'test.txt'}
            ];

        validValues.forEach(value=> expect(Validator.ruleValidator.fileType(value, ['application/pdf'])).toBe(true));
        invalidValues.forEach(value=> expect(Validator.ruleValidator.fileType(value, ['image/jpg'])).toBe(false));
    });

    it("enum", function () {
        enum TestEnum {First, Second = 2, Third}
        let invalidValues = [null, undefined, 'test', -3],
            validValues = [null, undefined, 0, TestEnum.First];

        validValues.forEach(value=> expect(Validator.ruleValidator.enum(value, [null, undefined, 0, TestEnum.First])).toBe(true));
        invalidValues.forEach(value=> expect(Validator.ruleValidator.enum(value, [0, 1, 2, 3, 4])).toBe(false));
        invalidValues.forEach(value=> expect(Validator.ruleValidator.enum(value, [TestEnum.First, TestEnum.Second, TestEnum.Third])).toBe(false));
    });

    it("email", function () {
        let validEmails = ['a@b.co', 'a-b@c-d.co'],
            invalidEmails = ['ash', 'ab@sdf', 'asd$@tex.com'];

        validEmails.forEach(value=> expect(Validator.ruleValidator.email(value)).toBe(true));
        invalidEmails.forEach(value=> expect(Validator.ruleValidator.email(value)).toBe(false));
    });

    it("url", function () {
        let validNumbers = ['http://142.42.1.1', 'http://foo.com/blah_blah'],
            invalidNumbers = ['http://-a.b.co', 'http://foo.bar?q=Something&foo=bar'];

        validNumbers.forEach(value=> expect(Validator.ruleValidator.url(value)).toBe(true));
        invalidNumbers.forEach(value=> expect(Validator.ruleValidator.url(value)).toBe(false));
    });

    it("number, integer, float", function () {
        let validNumbers = [2, 25, -35, 0, '0', '-33', Infinity, .33],
            invalidNumbers = [NaN, 'test', '4tr'];

        validNumbers.forEach(value=> expect(Validator.ruleValidator.number(value)).toBe(true));
        invalidNumbers.forEach(value=> expect(Validator.ruleValidator.number(value)).toBe(false));
        //
        validNumbers.forEach(value=> expect(Validator.ruleValidator.integer(value)).toBe(true));
        invalidNumbers.forEach(value=> expect(Validator.ruleValidator.integer(value)).toBe(false));
        //
        validNumbers.forEach(value=> expect(Validator.ruleValidator.float(value)).toBe(true));
        invalidNumbers.forEach(value=> expect(Validator.ruleValidator.float(value)).toBe(false));
    });

    it("tel", function () {
        let validNumbers = [9111234567, '+9812345678', '0098 911-123-4567', '0098 (912) 123-4567'],
            invalidNumbers = [NaN, '98 (912) 123_4567', '1234567'];

        validNumbers.forEach(value=> expect(Validator.ruleValidator.tel(value)).toBe(true));
        invalidNumbers.forEach(value=> expect(Validator.ruleValidator.tel(value)).toBe(false));
    });

    it("boolean", function () {
        let validValues = [true, false],
            invalidValues = [NaN, '', 2, null, undefined];

        validValues.forEach(value=> expect(Validator.ruleValidator.boolean(value)).toBe(true));
        invalidValues.forEach(value=> expect(Validator.ruleValidator.boolean(value)).toBe(false));
    });

    it('list', function () {

    });

});

describe('Testing Validator.validateField', function () {
    it('Validating list', function () {
        let test = new Test();
        let validationSchema = Test.schema.validateSchema;
        let values = test.getValues<ITest>();
        expect(Validator.validateField(Test.schema.getField('emails'), validationSchema['emails'], values)).toBe('required');
        expect(Validator.validateField(Test.schema.getField('permissions'), validationSchema['permissions'], values)).toBe('required');
        test.emails.push('invalid@email');
        test.emails.push('valid@email.com');
        validationSchema = Test.schema.validateSchema;
        values = test.getValues<ITest>();
        expect(Validator.validateField(Test.schema.getField('emails'), validationSchema['emails'], values)).toBe('type');
    });
});

describe('Testing Validator.validate', function () {
    it('Validating model', function () {
        let user = new User();
        let validationError = user.validate();
        expect(validationError).not.toBeNull();
        expect(validationError['username'].rule).toBe('required');
        expect(validationError['password'].rule).toBe('required');
        user.username = 'vesta';
        user.password = 'vesta-secret';
        validationError = user.validate();
        expect(validationError).toBe(null);
        user.email = 'invalid@email';
        validationError = user.validate();
        expect(validationError).not.toBe(null);
    });
});

describe('Testing relation', function () {
    it('Validating one2many relations', function () {

    });

    it('Validating many2many relations', function () {
        let test = new Test();
        let validationResult = test.validate('permissions');
        expect(validationResult['permissions'].rule).toBe('required');
        test.permissions.push(1, 3);
        expect(test.validate('permissions')).toBe(null);
        let permission = new Permission();
        test.permissions = [permission.getValues()];
        expect(test.validate('permissions')['permissions'].rule).toBe('relation');
        permission.resource = 'resource';
        permission.action = 'action';
        test.permissions = [permission.getValues()];
        expect(test.validate('permissions')).toBe(null);
    });

});