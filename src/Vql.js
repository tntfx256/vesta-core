import { Condition } from "./Condition";
/**
 * Vesta Query Language
 *
 */
export class Vql {
    constructor(model) {
        // IQueryOption
        this.limit = 0;
        this.offset = 0;
        this.page = 1;
        this.fields = [];
        this.orderBy = [];
        this.relations = [];
        this.joins = [];
        this.model = model;
    }
    search(filter, model) {
        let condition = new Condition(Condition.Operator.And);
        let fieldsData = model.schema.getFields();
        for (let field in filter) {
            if (filter.hasOwnProperty(field)) {
                let cmp;
                let fieldData = fieldsData[field];
                let value = filter[field];
                if (fieldData && fieldData.properties.type == 11 /* Timestamp */) {
                    let date = new Date(value);
                    let start = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
                    let end = start + (86400000);
                    cmp = new Condition(Condition.Operator.And);
                    cmp.append(new Condition(Condition.Operator.GreaterThanOrEqualTo).compare(field, start))
                        .append(new Condition(Condition.Operator.LessThanOrEqualTo).compare(field, end));
                }
                else if (filter[field].indexOf('*') >= 0 || filter[field].indexOf('?') >= 0) {
                    value = value.replace(/\*/g, '%');
                    value = value.replace(/\?/g, '_');
                    cmp = new Condition(Condition.Operator.Like);
                    cmp.compare(field, value);
                }
                else {
                    cmp = new Condition(Condition.Operator.EqualTo);
                    cmp.compare(field, value);
                }
                condition.append(cmp);
            }
        }
        this.condition = this.condition ? (new Condition(Condition.Operator.And)).append(this.condition).append(condition) : condition;
        return this;
    }
    filter(filter) {
        let condition = new Condition(Condition.Operator.And);
        for (let field in filter) {
            if (filter.hasOwnProperty(field)) {
                let cmp;
                cmp = new Condition(Condition.Operator.EqualTo);
                cmp.compare(field, filter[field]);
                condition.append(cmp);
            }
        }
        this.condition = this.condition ? (new Condition(Condition.Operator.And)).append(this.condition).append(condition) : condition;
        return this;
    }
    select(...fields) {
        this.fields = fields;
        return this;
    }
    limitTo(limit = 1) {
        this.limit = limit;
        return this;
    }
    fromOffset(offset) {
        this.offset = offset;
        return this;
    }
    fromPage(page) {
        this.page = page;
        return this;
    }
    sortBy(arg1, ascending = true) {
        if ('string' == typeof arg1) {
            return this.sortByField(arg1, ascending);
        }
        else if (arg1 instanceof Array) {
            return this.sortByList(arg1);
        }
        return this;
    }
    sortByList(orderBy) {
        this.orderBy = this.orderBy.concat(orderBy);
        return this;
    }
    sortByField(field, ascending = true) {
        for (let i = this.orderBy.length; i--;) {
            if (this.orderBy[i].field == field) {
                this.orderBy[i] = { field: field, ascending: ascending };
                return this;
            }
        }
        this.orderBy.push({ field: field, ascending: ascending });
        return this;
    }
    fetchRecordFor(...fields) {
        for (let i = fields.length; i--;) {
            let field = fields[i];
            if (this.relations.indexOf(field) < 0) {
                this.relations.push(field);
            }
        }
        return this;
    }
    where(condition) {
        this.condition = this.condition ? (new Condition(Condition.Operator.And)).append(this.condition).append(condition) : condition;
        return this;
    }
    join(field, arg1, arg2, arg3) {
        let vql;
        let type;
        if (typeof arg1 == 'string') {
            vql = new Vql(arg1);
            vql.filter(arg2);
            type = arg3;
        }
        else {
            vql = arg1;
            type = arg2;
        }
        this.joins.push({ field: field, vql: vql, type: type ? type : Vql.LeftJoin });
        return this;
    }
}
//join
Vql.InnerJoin = 1;
Vql.LeftJoin = 2;
Vql.RightJoin = 3;
Vql.Join = 4;
