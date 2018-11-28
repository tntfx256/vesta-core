export interface IErrType {
    errno: number;
    code: string;
}

export class Err implements Error, IErrType {
    public code: string;
    public errno: number;
    public message: string;
    public name: string;
    public method: string;
    public file: string;

    public static Code = {
        DBConnection: { errno: 560, code: "err_db_conn" },
        Database: { errno: 561, code: "err_db_op" },
        DBDuplicateEntry: { errno: 562, code: "err_dup_entry" },
        DBQuery: { errno: 563, code: "err_db_query" },
        DBInsert: { errno: 564, code: "err_db_insert" },
        DBUpdate: { errno: 565, code: "err_db_update" },
        DBDelete: { errno: 566, code: "err_db_delete" },
        DBInvalidDriver: { errno: 567, code: "err_db_driver" },
        /** When query is suppose to return one record, but returns more */
        DBRecordCount: { errno: 568, code: "err_db_record_cnt" },
        /** When query is suppose to return some records, but returns none */
        DBNoRecord: { errno: 569, code: "err_db_no_record" },
        DBRelation: { errno: 570, code: "err_db_relation" },
        // acl
        Unauthorized: { errno: 401, code: "err_unauthorized" },
        Forbidden: { errno: 403, code: "err_forbidden" },
        Client: { errno: 400, code: "err_bad_req" },
        Server: { errno: 500, code: "err_server" },
        Token: { errno: 571, code: "err_token" },
        // logical
        WrongInput: { errno: 460, code: "err_input" },
        OperationFailed: { errno: 582, code: "err_op" },
        // form
        Validation: { errno: 461, code: "err_validation" },
        //
        FileSystem: { errno: 584, code: "err_file" },
        Device: { errno: 462, code: "err_device" },
        //
        Implementation: { errno: 591, code: "err_method_impl" },
        NoDataConnection: { errno: 592, code: "err_net_conn" },
        Unknown: { errno: 599, code: "err_unknown" },
    };

    constructor(type: IErrType = Err.Code.Unknown, message?: string, method?: string, file?: string) {
        this.code = type.code;
        this.errno = type.errno;
        this.message = message || type.code;
        this.method = method || "";
        this.file = file || "";
        this.name = "";
    }
}
