export interface IComparison {
    field?: string;
    value?: any
    isValueOfTypeField?: boolean;
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
    public comparison: IComparison = {};
    public children: Array<Condition> = [];
    public isConnector: boolean = false;
    public operator: number;
    public model: string = "";

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
        this.comparison = { field: field, value: value, isValueOfTypeField: isValueOfTypeField };
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
