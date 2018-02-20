import { Condition } from "./Condition";

export class Hlc {
    public static and(...conditions: Array<Condition>): Condition {
        return Hlc.conditionList(Condition.Operator.And, ...conditions);
    }

    public static or(...conditions: Array<Condition>): Condition {
        return Hlc.conditionList(Condition.Operator.Or, ...conditions);
    }

    public static eq(filed: string, value: any, isValueOfTypeField: boolean = false) {
        return Hlc.compare(Condition.Operator.EqualTo, filed, value, isValueOfTypeField);
    }

    public static gt(filed: string, value: any, isValueOfTypeField: boolean = false) {
        return Hlc.compare(Condition.Operator.GreaterThan, filed, value, isValueOfTypeField);
    }

    public static egt(filed: string, value: any, isValueOfTypeField: boolean = false) {
        return Hlc.compare(Condition.Operator.GreaterThanOrEqualTo, filed, value, isValueOfTypeField);
    }

    public static lt(filed: string, value: any, isValueOfTypeField: boolean = false) {
        return Hlc.compare(Condition.Operator.LessThan, filed, value, isValueOfTypeField);
    }

    public static elt(filed: string, value: any, isValueOfTypeField: boolean = false) {
        return Hlc.compare(Condition.Operator.LessThanOrEqualTo, filed, value, isValueOfTypeField);
    }

    public static like(filed: string, value: any, isValueOfTypeField: boolean = false) {
        return Hlc.compare(Condition.Operator.Like, filed, value, isValueOfTypeField);
    }

    public static regex(filed: string, value: any, isValueOfTypeField: boolean = false) {
        return Hlc.compare(Condition.Operator.Regex, filed, value, isValueOfTypeField);
    }

    public static inList(filed: string, values: Array<any>, isValueOfTypeField: boolean = false) {
        if (!values.length) return Hlc.and(Hlc.eq(filed, '0'), Hlc.not(Hlc.eq(filed, '0')));
        let conditions: Array<Condition> = [];
        values.forEach(value => conditions.push(Hlc.compare(Condition.Operator.EqualTo, filed, value, isValueOfTypeField)));
        return Hlc.or(...conditions);
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