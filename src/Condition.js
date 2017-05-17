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
    constructor(operator, model = '') {
        this.children = [];
        this.isConnector = false;
        this.operator = operator;
        this.isConnector = operator < 10;
        this.setModel(model);
    }
    /**
     *
     * If the operator is of type comparison
     */
    compare(field, value, isValueOfTypeField = false) {
        if (this.isConnector)
            return this;
        this.comparison = { field: field, value: value, isValueOfTypeField: isValueOfTypeField };
        return this;
    }
    setModel(model) {
        this.model = model;
        return this;
    }
    append(child) {
        if (!this.isConnector)
            return this;
        this.children.push(child);
        return this;
    }
    traverse(cb) {
        cb(this);
        for (let i = 0, il = this.children.length; i < il; ++i) {
            let child = this.children[i];
            child.isConnector ? child.traverse(cb) : cb(child);
        }
    }
    negateChildren() {
        for (let i = 0, il = this.children.length; i < il; ++i) {
            this.children[i].negate();
        }
    }
    negate() {
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
Condition.Operator = {
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
export class HLCondition {
    static and(...conditions) {
        return HLCondition.conditionList(Condition.Operator.And, ...conditions);
    }
    static or(...conditions) {
        return HLCondition.conditionList(Condition.Operator.Or, ...conditions);
    }
    static eq(filed, value, isValueOfTypeField = false) {
        return HLCondition.compare(Condition.Operator.EqualTo, filed, value, isValueOfTypeField);
    }
    static gt(filed, value, isValueOfTypeField = false) {
        return HLCondition.compare(Condition.Operator.GreaterThan, filed, value, isValueOfTypeField);
    }
    static egt(filed, value, isValueOfTypeField = false) {
        return HLCondition.compare(Condition.Operator.GreaterThanOrEqualTo, filed, value, isValueOfTypeField);
    }
    static lt(filed, value, isValueOfTypeField = false) {
        return HLCondition.compare(Condition.Operator.LessThan, filed, value, isValueOfTypeField);
    }
    static elt(filed, value, isValueOfTypeField = false) {
        return HLCondition.compare(Condition.Operator.LessThanOrEqualTo, filed, value, isValueOfTypeField);
    }
    static like(filed, value, isValueOfTypeField = false) {
        return HLCondition.compare(Condition.Operator.Like, filed, value, isValueOfTypeField);
    }
    static regex(filed, value, isValueOfTypeField = false) {
        return HLCondition.compare(Condition.Operator.Regex, filed, value, isValueOfTypeField);
    }
    static inList(filed, values, isValueOfTypeField = false) {
        let conditions = [];
        values.forEach(value => conditions.push(HLCondition.compare(Condition.Operator.EqualTo, filed, value, isValueOfTypeField)));
        return HLCondition.or(...conditions);
    }
    static compare(type, filed, value, isValueOfTypeField = false) {
        let equal = new Condition(type);
        equal.compare(filed, value, isValueOfTypeField);
        return equal;
    }
    static not(condition) {
        condition.negate();
        return condition;
    }
    static conditionList(type, ...conditions) {
        let condition = new Condition(type);
        for (let i = 0; i < conditions.length; i++) {
            condition.append(conditions[i]);
        }
        return condition;
    }
}
