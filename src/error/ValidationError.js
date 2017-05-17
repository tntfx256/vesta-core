import { Err } from "../Err";
export class ValidationError extends Err {
    constructor(violations, message) {
        super(Err.Code.Validation, message);
        this.violations = violations;
    }
}
