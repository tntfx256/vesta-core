export interface IComparison {
    field: string;
    value: any
    isValueOfTypeField: boolean;
}

export interface ITraverseCallback {
    (condition: Condition): void;
}

/**
 * It has two main category
 *  - comparison (`isConnector` = false): it compares a field with a value
 *      The comparison operator is a above  10
 *      Attention: The value for comparison might be another field e.g. model.fieldA > model.fieldC
 *  - conjunction (`isConnector` = false):: it connects two or more comparison by logical operators (AND, OR)
 *      The conjunction operator is a number below 10
 *
 * The data structure is a tree and each internal node is of type `Condition.Operator`. The values a
 */
export class Condition {
    public static Operator = {
        Or: 1,
        And: 2,
        EqualTo: 11,
        NotEqualTo: 12,
        GreaterThan: 13,
        GreaterThanOrEqualTo: 14,
        LessThan: 15,
        LessThanOrEqualTo: 16,
        Like: 17,
        NotLike: 18,
        Regex: 19,
        NotRegex: 20
    };
    public comparison: IComparison;
    public children: Array<Condition> = [];
    public isConnector: boolean = false;
    public operator: number;
    public model: string;

    constructor(operator: number, model: string = '') {
        this.operator = operator;
        this.isConnector = operator < 10;
        this.setModel(model);
    }

    /**
     *
     * If the operator is of type comparison
     */
    public compare(field: string, value: any, isValueOfTypeField: boolean = false): Condition {
        if (this.isConnector) return this;
        this.comparison = {field: field, value: value, isValueOfTypeField: isValueOfTypeField};
        return this;
    }

    public setModel(model: string) {
        this.model = model;
        return this;
    }

    public append(child: Condition): Condition {
        if (!this.isConnector) return this;
        this.children.push(child);
        return this;
    }

    public traverse(cb: ITraverseCallback) {
        cb(this);
        for (let i = 0, il = this.children.length; i < il; ++i) {
            let child = this.children[i];
            child.isConnector ? child.traverse(cb) : cb(child);
        }
    }

    private negateChildren() {
        for (let i = 0, il = this.children.length; i < il; ++i) {
            this.children[i].negate();
        }
    }

    public negate() {
        switch (this.operator) {
            // Connectors
            case Condition.Operator.And:
                this.operator = Condition.Operator.Or;
                this.negateChildren();
                break;
            case Condition.Operator.Or:
                this.operator = Condition.Operator.And;
                this.negateChildren();
                break;
            // Comparison
            case Condition.Operator.EqualTo:
                this.operator = Condition.Operator.NotEqualTo;
                break;
            case Condition.Operator.NotEqualTo:
                this.operator = Condition.Operator.EqualTo;
                break;
            case Condition.Operator.GreaterThan:
                this.operator = Condition.Operator.LessThanOrEqualTo;
                break;
            case Condition.Operator.GreaterThanOrEqualTo:
                this.operator = Condition.Operator.LessThan;
                break;
            case Condition.Operator.LessThan:
                this.operator = Condition.Operator.GreaterThanOrEqualTo;
                break;
            case Condition.Operator.LessThanOrEqualTo:
                this.operator = Condition.Operator.GreaterThan;
                break;
            case Condition.Operator.Like:
                this.operator = Condition.Operator.NotLike;
                break;
            case Condition.Operator.NotLike:
                this.operator = Condition.Operator.Like;
                break;
            case Condition.Operator.Regex:
                this.operator = Condition.Operator.NotRegex;
                break;
            case Condition.Operator.NotRegex:
                this.operator = Condition.Operator.Regex;
                break;
        }
    }
}

export class HLCondition {
    public static and(...conditions: Array<Condition>): Condition {
        return HLCondition.conditionList(Condition.Operator.And, ...conditions);
    }

    public static or(...conditions: Array<Condition>): Condition {
        return HLCondition.conditionList(Condition.Operator.Or, ...conditions);
    }

    public static eq(filed: string, value: any, isValueOfTypeField: boolean = false) {
        return HLCondition.compare(Condition.Operator.EqualTo, filed, value, isValueOfTypeField);
    }

    public static gt(filed: string, value: any, isValueOfTypeField: boolean = false) {
        return HLCondition.compare(Condition.Operator.GreaterThan, filed, value, isValueOfTypeField);
    }

    public static egt(filed: string, value: any, isValueOfTypeField: boolean = false) {
        return HLCondition.compare(Condition.Operator.GreaterThanOrEqualTo, filed, value, isValueOfTypeField);
    }

    public static lt(filed: string, value: any, isValueOfTypeField: boolean = false) {
        return HLCondition.compare(Condition.Operator.LessThan, filed, value, isValueOfTypeField);
    }

    public static elt(filed: string, value: any, isValueOfTypeField: boolean = false) {
        return HLCondition.compare(Condition.Operator.LessThanOrEqualTo, filed, value, isValueOfTypeField);
    }

    public static like(filed: string, value: any, isValueOfTypeField: boolean = false) {
        return HLCondition.compare(Condition.Operator.Like, filed, value, isValueOfTypeField);
    }

    public static regex(filed: string, value: any, isValueOfTypeField: boolean = false) {
        return HLCondition.compare(Condition.Operator.Regex, filed, value, isValueOfTypeField);
    }

    public static inList(filed: string, values: Array<any>, isValueOfTypeField: boolean = false) {
        if (!values.length) return HLCondition.and(HLCondition.eq(filed, '0'), HLCondition.not(HLCondition.eq(filed, '0')));
        let conditions: Array<Condition> = [];
        values.forEach(value => conditions.push(HLCondition.compare(Condition.Operator.EqualTo, filed, value, isValueOfTypeField)));
        return HLCondition.or(...conditions);
    }

    private static compare(type: number, filed: string, value: any, isValueOfTypeField: boolean = false) {
        let equal = new Condition(type);
        equal.compare(filed, value, isValueOfTypeField);
        return equal;
    }

    public static not(condition: Condition) {
        condition.negate();
        return condition;
    }

    private static conditionList(type: number, ...conditions: Array<Condition>) {
        let condition = new Condition(type);
        for (let i = 0; i < conditions.length; i++) {
            condition.append(conditions[i]);
        }
        return condition;
    }
}