import { Condition } from "./Condition";
import { IOrderBy, IQueryOption } from "./Database";
import { FieldType } from "./Field";
import { IModel, IModelValues } from "./Model";

/**
 * Vesta Query Language
 *
 */
export class Vql implements IQueryOption {
    //join
    public static InnerJoin = 1;
    public static LeftJoin = 2;
    public static RightJoin = 3;
    public static Join = 4;
    // IQueryOption
    public limit: number = 0;
    public offset: number = 0;
    public page: number = 1;
    public fields: Array<string | Vql> = [];
    public orderBy: Array<IOrderBy> = [];
    public relations: Array<string | { name: string, fields: Array<string> }> = [];
    public joins: Array<{ field: string, vql: Vql, type: number }> = [];
    // Vql
    public model: string;
    public condition: Condition;

    constructor(model: string) {
        this.model = model;
    }

    public search(filter: IModelValues, model: IModel): Vql {
        let condition = new Condition(Condition.Operator.And);
        let fieldsData = model.schema.getFields();
        for (let field in filter) {
            if (filter.hasOwnProperty(field) && filter[field] !== undefined) {
                let cmp;
                let fieldData = fieldsData[field];
                let value = filter[field];
                if (fieldData && fieldData.properties.type == FieldType.Timestamp) {
                    let date = new Date(value);
                    let start = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
                    let end = start + (86400000);
                    cmp = new Condition(Condition.Operator.And);
                    cmp.append(new Condition(Condition.Operator.GreaterThanOrEqualTo).compare(field, start))
                        .append(new Condition(Condition.Operator.LessThanOrEqualTo).compare(field, end))
                } else if ('string' == typeof filter[field] && (filter[field].indexOf('*') >= 0 || filter[field].indexOf('?') >= 0)) {
                    value = value.replace(/\*/g, '%');
                    value = value.replace(/\?/g, '_');
                    cmp = new Condition(Condition.Operator.Like);
                    cmp.compare(field, value);
                } else {
                    cmp = new Condition(Condition.Operator.EqualTo);
                    cmp.compare(field, value);
                }
                condition.append(cmp);
            }
        }
        this.condition = this.condition ? (new Condition(Condition.Operator.And)).append(this.condition).append(condition) : condition;
        return this;
    }

    public filter(filter: IModelValues): Vql {
        let condition = new Condition(Condition.Operator.And);
        for (let field in filter) {
            if (filter.hasOwnProperty(field) && filter[field] !== undefined) {
                let cmp;
                cmp = new Condition(Condition.Operator.EqualTo);
                cmp.compare(field, filter[field]);
                condition.append(cmp);
            }
        }
        this.condition = this.condition ? (new Condition(Condition.Operator.And)).append(this.condition).append(condition) : condition;
        return this;
    }

    public select(...fields: Array<string | Vql>): Vql {
        this.fields = fields;
        return this;
    }

    public limitTo(limit: number = 1): Vql {
        this.limit = limit;
        return this;
    }

    public fromOffset(offset: number): Vql {
        this.offset = offset;
        return this;
    }

    public fromPage(page: number): Vql {
        this.page = page;
        return this;
    }

    public sortBy(orderBy: IOrderBy): Vql;
    public sortBy(field: string, ascending?: boolean): Vql;
    public sortBy(arg1: IOrderBy | string, ascending: boolean = true): Vql {
        if ("string" == typeof arg1) {
            return this.sortByField(arg1 as string, ascending);
        } else if (arg1 instanceof Array) {
            return this.sortByList(arg1 as IOrderBy);
        }
        return this;
    }

    public fetchRecordFor(...fields: Array<string | { fields: Array<string>, name: string }>): Vql {
        for (let i = fields.length; i--;) {
            const field = fields[i];
            if (this.relations.indexOf(field) < 0) {
                this.relations.push(field);
            }
        }
        return this;
    }

    public where(condition: Condition): Vql {
        this.condition = this.condition ? (new Condition(Condition.Operator.And)).append(this.condition).append(condition) : condition;
        return this;
    }

    public join<T>(field: string, vql: Vql, type?: number): Vql;
    public join<T>(field: string, model: string, value: T, type?: number): Vql;
    public join<T>(field: string, arg1: Vql | string, arg2: number | T, arg3?: number): Vql {
        let vql: Vql;
        let type;
        if (typeof arg1 == "string") {
            vql = new Vql(arg1 as string);
            vql.filter(arg2 as T);
            type = arg3;
        } else {
            vql = arg1 as Vql;
            type = arg2;
        }
        this.joins.push({ field, vql, type: type ? type : Vql.LeftJoin });
        return this;
    }
    private sortByList(orderBy: IOrderBy): Vql {
        this.orderBy = this.orderBy.concat(orderBy);
        return this;
    }

    private sortByField(field: string, ascending: boolean = true): Vql {
        for (let i = this.orderBy.length; i--;) {
            if (this.orderBy[i].field == field) {
                this.orderBy[i] = { field, ascending };
                return this;
            }
        }
        this.orderBy.push({ field, ascending });
        return this;
    }
}