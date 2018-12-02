import { Field, FieldType, IRelation, RelationType } from "./Field";
import { Mime } from "./Mime";
import { IModelValues } from "./Model";
import { isClient } from './Platform';
import { Schema } from "./Schema";

export type IAssertCallback = (value: any, field: Field, allValues: IModelValues) => boolean;

export interface IValidationModel {
    [ruleName: string]: any;
}

export interface IValidationModelSet {
    [fieldName: string]: IValidationModel;
}

export interface IValidationError {
    // fieldName: failedRuleName
    [fieldName: string]: string;
}

export class Validator {
    public static regex = {
        email: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/i,
        phone: /^[0-9\+][0-9 \-\()]{7,18}$/,
        url: /^(https?|ftp):\/\/(-\.)?([^\s/?\.#-]+\.?)+(\/[^\s]*)?$/i,
    };

    /**
     * Each validator is a function with the following parameters -the name of the function is the same as it's validation rule-
     *
     * value        this parameter contains the value that is going to be validated
     * ruleValue    this parameter contains the value of the rule that is defined in schema. Each function may alter the
     *                  name of this parameter to a more meaningful name
     *                  ruleName    parameterName   ruleValue
     *                  ------------------------------------------------------------
     *                  required    isRequired      true|false
     *                  minLength   minLength       5
     *                  pattern     regex           /[a-z]+/ig
     *                  assert      cb              function():boolean{ return true}
     *                  fileType    acceptedTypes   ['image/png','application/pdf']
     *                  enum        enumValues      [Status.Active, Status.Inactive]
     *                  -------------------------------------------------------------
     * field        the Field object of current field being validated
     * allValues    this parameter contains the values of all fields in {fieldName: fieldValue} format
     *
     */
    public static ruleValidator = {
        assert(value: any, cb: IAssertCallback, field: Field, allValues: IModelValues): boolean {
            return cb(value, field, allValues);
        },
        boolean(value: any): boolean {
            return (value === true || value === false || value === 0 || value === 1);
        },
        email(value: string): boolean {
            return !!Validator.regex.email.exec(value);
        },
        enum(value: any, enumValues: Array<any>): boolean {
            return enumValues.indexOf(value) >= 0;
        },
        fileType(value: File, acceptedTypes: Array<string>): boolean {
            if ("string" == typeof value) { return true; }
            if (!value || !value.name) { return false; }
            if (isClient()) {
                if (!(value instanceof File)) {
                    return false;
                }
            }
            const part = value.name.split(".");
            let isExtensionValid = true;
            if (part.length) {
                isExtensionValid = false;
                const mime = Mime.getMime(part[part.length - 1]);
                for (let i = mime.length; i--;) {
                    if (acceptedTypes.indexOf(mime[i]) >= 0) {
                        isExtensionValid = true;
                        break;
                    }
                }
            }
            if (value.type == "application/octet-stream" || !value.type || !Mime.isValid(value.type)) {
                return isExtensionValid;
            } else {
                return isExtensionValid && acceptedTypes.indexOf(value.type) >= 0;
            }
        },
        float(value: any): boolean {
            return !isNaN(value);
        },
        integer(value: any): boolean {
            return !isNaN(value);
        },
        list(value: any, itemType: FieldType, field: Field, allValues: IModelValues): boolean {
            // console.log(value, itemType);
            for (let i = 0, il = value.length; i < il; ++i) {
                // console.log(value[i]);
                const err = Validator.ruleValidator.type(value[i], itemType, field, allValues);
                if (!err) {
                    return false;
                }
            }
            return true;
        },
        max(value: any, max: number): boolean {
            return !isNaN(value) && value != null && value <= max;
        },
        maxLength(value: any, maxLength: number): boolean {
            return typeof value === "string" && value.length <= maxLength;
        },
        maxSize(value: File, size: number): boolean {
            return "string" == typeof value || !!(value && value.size && value.size <= size * 1024);
        },
        min(value: any, min: number): boolean {
            return !isNaN(value) && value != null && value >= min;
        },
        minLength(value: any, minLength: number): boolean {
            return typeof value === "string" && value.length >= minLength;
        },
        number(value: any): boolean {
            return !isNaN(value);
        },
        pattern(value: any, regex: RegExp): boolean {
            return !!regex.exec(value);
        },
        relation(value: any, relation: IRelation, field: Field): boolean {
            // many2many
            if (relation.type == RelationType.Many2Many) {
                for (let i = value.length; i--;) {
                    const thisValue = value[i];
                    const valueType = typeof thisValue;
                    if (valueType == "string" || valueType == "number") {
                        continue;
                    }
                    if (valueType != "object") {
                        return false;
                    }
                    const instance = new (field.properties.relation as IRelation).model(thisValue);
                    if (instance.validate(...Validator.getNotEmptyFields(instance.getValues()))) {
                        return false;
                    }
                }
                return true;
            } else if (relation.type == RelationType.One2Many) {
                // one2one | one2many
                const valueType = typeof value;
                if (valueType == "string" || valueType == "number") {
                    return true;
                }
                if (valueType != "object") {
                    return false;
                }
                const instance = new (field.properties.relation as IRelation).model(value);
                return instance.validate(...Validator.getNotEmptyFields(instance.getValues())) == null;
            }
            return false;
        },
        required(value: any, isRequired: boolean, field?: Field): boolean {
            if (!isRequired) {
                return true;
            }
            if ([null, undefined, ""].indexOf(value) >= 0) {
                return false;
            }
            if (field) {
                switch (field.properties.type) {
                    case FieldType.List:
                        return value.length > 0;
                    case FieldType.Relation:
                        if ((field.properties.relation as IRelation).type == RelationType.Many2Many) {
                            return value.length > 0;
                        }
                }
            }
            return true;
        },
        // field types; second arg is undefined
        string(value: any): boolean {
            return "string" === typeof value;
        },
        type(value: any, type: FieldType, field: Field, allValues: IModelValues): boolean {
            switch (type) {
                case FieldType.String:
                case FieldType.Password:
                case FieldType.Text:
                    return Validator.ruleValidator.string(value);
                case FieldType.Enum:
                    return Validator.ruleValidator.enum(value, field.properties.enum as any[]);
                case FieldType.EMail:
                    return Validator.ruleValidator.email(value);
                case FieldType.URL:
                    return Validator.ruleValidator.url(value);
                case FieldType.Integer:
                    return Validator.ruleValidator.integer(value);
                case FieldType.Number:
                    return Validator.ruleValidator.number(value);
                case FieldType.Float:
                    return Validator.ruleValidator.float(value);
                case FieldType.Tel:
                    return Validator.ruleValidator.tel(value);
                case FieldType.Boolean:
                    return Validator.ruleValidator.boolean(value);
                case FieldType.Timestamp:
                    return Validator.ruleValidator.timestamp(value);
                case FieldType.List:
                    return Validator.ruleValidator.list(value, field.properties.list, field, allValues);
            }
            return true;
        },
        tel(phoneNumber: any): boolean {
            return !!Validator.regex.phone.exec(phoneNumber);
        },
        timestamp(value: any): boolean {
            return !isNaN(value);
        },
        unique(value: any, isUnique: boolean, field: Field): boolean {
            if (!isUnique) {
                return true;
            }
            // we may only check the unique in list type
            if (field.properties.type == FieldType.List) {
                for (let i = value.length; i--;) {
                    for (let j = i - 1; j--;) {
                        if (value[i] == value[j]) {
                            return false;
                        }
                    }
                }
            }
            return true;
        },
        url(url: any): boolean {
            return !!Validator.regex.url.exec(url);
        },
    };

    // required is checked separately => should be skipped
    private static skippedRules = ["required", "default", "primary", "file", "object"];

    /**
     * Returns the validation error on the {fieldName: value} object
     */
    public static validate(values: IModelValues, schema: Schema): IValidationError {
        const validationPatterns: IValidationModelSet = schema.validateSchema;
        let errors: IValidationError = null as any as IValidationError;
        // let valid = true;
        for (let fieldNames = Object.keys(validationPatterns), i = 0, il = fieldNames.length; i < il; ++i) {
            const fieldName = fieldNames[i];
            const isRequired = "required" in validationPatterns[fieldName];
            const fieldValue = values[fieldName];
            const hasValue = values.hasOwnProperty(fieldName) && fieldValue !== undefined && fieldValue !== null && fieldValue !== "";
            const field = schema.getField(fieldName);
            if (isRequired || hasValue) {
                const result = Validator.validateField(field, validationPatterns[fieldName], values);
                if (result) {
                    if (!errors) {
                        errors = {};
                    }
                    errors[fieldName] = result;
                }
            }
        }
        return errors;
    }

    /**
     * Returns the name of the rule that has failed
     */
    public static validateField(field: Field, validationRules: IValidationModel, allValues: IModelValues): string {
        if (!field) {
            field = {} as Field;
        }
        if (!validationRules) {
            return "";
        }
        const value = allValues[field.fieldName];
        // checking required rule
        if (!Validator.ruleValidator.required(value, validationRules.required, field)) {
            return "required";
        }
        const validationRulesCpy = JSON.parse(JSON.stringify(validationRules));
        // since required has been checked, it must be removed from rules
        delete validationRulesCpy.required;
        //  if the field is of type List, the validation must be applied on each list
        if (field.properties.type == FieldType.List) {
            // checking type on each list items
            if (!Validator.ruleValidator.type(value, field.properties.type, field, allValues)) {
                return "type";
            }
            // since type has been checked, it must be removed from rules;
            // type will also trigger the list method
            delete validationRulesCpy.type;
            delete validationRulesCpy.list;
            for (let i = 0, il = value.length; i < il; ++i) {
                const err = validateValue(value[i], validationRulesCpy);
                if (err) { return err; }
            }
            return "";
        }
        return validateValue(value, validationRulesCpy);

        // this function checks all validation rules on a give value (might come from model->list->value or the model->value)
        function validateValue(value: any, validationRules: IValidationModel) {
            // console.log(validationRules, value);
            // looping over all other validation rules
            for (let rules = Object.keys(validationRules), i = 0, il = rules.length; i < il; ++i) {
                const rule = rules[i];
                if (Validator.skippedRules.indexOf(rule) >= 0) {
                    continue;
                }
                try {
                    if (!Validator.ruleValidator[rule](value, validationRules[rule], field, allValues)) {
                        return rule;
                    }
                } catch (e) {
                    console.error(`Error on validating ${rule}(${validationRules[rule]}): ${e.message}`);
                    return rule;
                }
            }
            return "";
        }
    }

    private static getNotEmptyFields(model: IModelValues) {
        const fields: string[] = [];
        for (let i = 0, keys = Object.keys(model), il = keys.length; i < il; i++) {
            if (model[keys[i]] instanceof Array && !model[keys[i]].length) {
                continue;
            }
            if (model[keys[i]] || model[keys[i]] === 0) {
                fields.push(keys[i]);
            }
        }
        return fields;
    }
}
