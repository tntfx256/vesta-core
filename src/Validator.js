import { Platform } from "./Platform";
import { FileMemeType } from "./FileMemeType";
export class Validator {
    /**
     * Returns the validation error on the {fieldName: value} object
     */
    static validate(values, schema) {
        let validationPatterns = schema.validateSchema;
        let errors = null;
        // let valid = true;
        for (let fieldNames = Object.keys(validationPatterns), i = 0, il = fieldNames.length; i < il; ++i) {
            let fieldName = fieldNames[i];
            let isRequired = validationPatterns[fieldName].hasOwnProperty('required');
            let hasValue = values.hasOwnProperty(fieldName) && values[fieldName] !== undefined && values[fieldName] !== null;
            let field = schema.getField(fieldName);
            if (isRequired || hasValue) {
                let result = Validator.validateField(field, validationPatterns[fieldName], values);
                if (result) {
                    if (!errors)
                        errors = {};
                    errors[fieldName] = { rule: result };
                    // valid = false;
                }
            }
        }
        return errors;
    }
    /**
     * Returns the name of the rule that has failed
     */
    static validateField(field, validationRules, allValues) {
        let value = allValues[field.fieldName];
        // checking required rule
        if (!Validator.ruleValidator.required(value, validationRules['required'], field))
            return 'required';
        let validationRulesCpy = JSON.parse(JSON.stringify(validationRules));
        // since required has been checked, it must be removed from rules
        delete validationRulesCpy['required'];
        //  if the field is of type List, the validation must be applied on each list
        if (field.properties.type == 16 /* List */) {
            // checking type on each list items
            if (!Validator.ruleValidator.type(value, field.properties.type, field, allValues))
                return 'type';
            // since type has been checked, it must be removed from rules;
            // type will also trigger the list method
            delete validationRulesCpy['type'];
            delete validationRulesCpy['list'];
            for (let i = 0, il = value.length; i < il; ++i) {
                let err = validateValue(value[i], validationRulesCpy);
                if (err)
                    return err;
            }
            return '';
        }
        return validateValue(value, validationRulesCpy);
        // this function checks all validation rules on a give value (might come from model->list->value or the model->value)
        function validateValue(value, validationRules) {
            // console.log(validationRules, value);
            // looping over all other validation rules
            for (let rules = Object.keys(validationRules), i = 0, il = rules.length; i < il; ++i) {
                let rule = rules[i];
                if (Validator.skippedRules.indexOf(rule) >= 0)
                    continue;
                try {
                    if (!Validator.ruleValidator[rule](value, validationRules[rule], field, allValues)) {
                        return rule;
                    }
                }
                catch (e) {
                    console.error(`Error on validating ${rule}(${validationRules[rule]}): ${e.message}`);
                    return rule;
                }
            }
            return '';
        }
    }
    static getNotEmptyFields(model) {
        let fields = [];
        for (let i = 0, keys = Object.keys(model), il = keys.length; i < il; i++) {
            if (model[keys[i]] instanceof Array && !model[keys[i]].length)
                continue;
            if (model[keys[i]] || model[keys[i]] === 0) {
                fields.push(keys[i]);
            }
        }
        return fields;
    }
}
Validator.regex = {
    'email': /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/i,
    'phone': /^[0-9\+][0-9 \-\()]{8,18}$/,
    'url': /^(https?|ftp):\/\/(-\.)?([^\s/?\.#-]+\.?)+(\/[^\s]*)?$/i
};
// required is checked separately => should be skipped
Validator.skippedRules = ['required', 'default', 'primary', 'file', 'object'];
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
Validator.ruleValidator = {
    required: function (value, isRequired, field) {
        if (!isRequired)
            return true;
        if ([null, undefined, ''].indexOf(value) >= 0)
            return false;
        if (field) {
            switch (field.properties.type) {
                case 16 /* List */:
                    return value.length > 0;
                case 15 /* Relation */:
                    if (field.properties.relation.type == 3 /* Many2Many */)
                        return value.length > 0;
            }
        }
        return true;
    },
    minLength: function (value, minLength) {
        return typeof value === 'string' && value.length >= minLength;
    },
    maxLength: function (value, maxLength) {
        return typeof value === 'string' && value.length <= maxLength;
    },
    pattern: function (value, regex) {
        return !!regex.exec(value);
    },
    min: function (value, min) {
        return !isNaN(value) && value != null && value >= min;
    },
    max: function (value, max) {
        return !isNaN(value) && value != null && value <= max;
    },
    assert: function (value, cb, field, allValues) {
        return cb(value, field, allValues);
    },
    maxSize: function (file, size) {
        return 'string' == typeof file || !!(file && file.size && file.size <= size * 1024);
    },
    fileType: function (file, acceptedTypes) {
        if ('string' == typeof file)
            return true;
        if (!file || !file.name)
            return false;
        if (Platform.isClient()) {
            if (!(file instanceof File)) {
                return false;
            }
        }
        let part = file.name.split('.');
        let isExtensionValid = true;
        if (part.length) {
            isExtensionValid = false;
            let meme = FileMemeType.getMeme(part[part.length - 1]);
            for (let i = meme.length; i--;) {
                if (acceptedTypes.indexOf(meme[i]) >= 0) {
                    isExtensionValid = true;
                    break;
                }
            }
        }
        if (file.type == 'application/octet-stream' || !file.type || !FileMemeType.isValid(file.type)) {
            return isExtensionValid;
        }
        else {
            return isExtensionValid && acceptedTypes.indexOf(file.type) >= 0;
        }
    },
    unique: function (value, isUnique, field) {
        if (field.properties.type == 16 /* List */) {
            for (let i = value.length; i--;) {
                for (let j = i - 1; j--;) {
                    if (value[i] == value[j])
                        return false;
                }
            }
        }
        return true;
    },
    relation: function (value, relation, field) {
        // many2many
        if (relation.type == 3 /* Many2Many */) {
            for (let i = value.length; i--;) {
                let thisValue = value[i];
                let valueType = typeof thisValue;
                if (valueType == 'string' || valueType == 'number')
                    continue;
                if (valueType != 'object')
                    return false;
                let instance = new field.properties.relation.model(thisValue);
                if (instance.validate(...Validator.getNotEmptyFields(instance.getValues())))
                    return false;
            }
            return true;
        }
        // one2one | one2many
        let valueType = typeof value;
        if (valueType == 'string' || valueType == 'number')
            return true;
        if (valueType != 'object')
            return false;
        let instance = new field.properties.relation.model(value);
        return instance.validate(...Validator.getNotEmptyFields(instance.getValues())) == null;
    },
    type: function (value, type, field, allValues) {
        switch (type) {
            case 1 /* String */:
            case 3 /* Password */:
            case 2 /* Text */:
                return Validator.ruleValidator.string(value);
            case 14 /* Enum */:
                return Validator.ruleValidator.enum(value, field.properties.enum);
            case 5 /* EMail */:
                return Validator.ruleValidator.email(value);
            case 6 /* URL */:
                return Validator.ruleValidator.url(value);
            case 8 /* Integer */:
                return Validator.ruleValidator.integer(value);
            case 7 /* Number */:
                return Validator.ruleValidator.number(value);
            case 9 /* Float */:
                return Validator.ruleValidator.float(value);
            case 4 /* Tel */:
                return Validator.ruleValidator.tel(value);
            case 12 /* Boolean */:
                return Validator.ruleValidator.boolean(value);
            case 11 /* Timestamp */:
                return Validator.ruleValidator.timestamp(value);
            case 16 /* List */:
                return Validator.ruleValidator.list(value, field.properties.list, field, allValues);
        }
        return true;
    },
    // field types; second arg is undefined
    string: function (value) {
        return 'string' === typeof value;
    },
    enum: function (value, enumValues) {
        return enumValues.indexOf(value) >= 0;
    },
    email: function (email) {
        return !!Validator.regex.email.exec(email);
    },
    url: function (url) {
        return !!Validator.regex.url.exec(url);
    },
    integer: function (number) {
        return !isNaN(+number);
    },
    number: function (number) {
        return !isNaN(+number);
    },
    float: function (number) {
        return !isNaN(+number);
    },
    tel: function (phoneNumber) {
        return !!Validator.regex.phone.exec(phoneNumber);
    },
    boolean: function (value) {
        return (value === true || value === false || value === 0 || value === 1);
    },
    timestamp: function (value) {
        return 'number' === typeof value;
    },
    list: function (value, itemType, field, allValues) {
        // console.log(value, itemType);
        for (let i = 0, il = value.length; i < il; ++i) {
            // console.log(value[i]);
            let err = Validator.ruleValidator.type(value[i], itemType, field, allValues);
            if (!err)
                return false;
        }
        return true;
    }
};
