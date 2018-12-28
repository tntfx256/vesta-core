import { IFieldValidationMessage, IModelValidationMessage, IValidationError } from "./Validator";

/**
 *  This method filters the error messages specified by validationErrors
 */
// tslint:disable-next-line:max-line-length
export function validationMessage(messages: IModelValidationMessage, validationErrors: IValidationError): IFieldValidationMessage {
    const appliedMessages: IFieldValidationMessage = {};
    for (let fieldNames = Object.keys(validationErrors), i = 0, il = fieldNames.length; i < il; ++i) {
        const fieldName = fieldNames[i];
        const failedRule = validationErrors[fieldName];
        appliedMessages[fieldName] = fieldName in messages ? messages[fieldName][failedRule] : null;
    }
    return appliedMessages;
}