export class Err implements Error {
    public code: number;
    public message: string;
    public name: string;

    public static Code = {
        DBConnection: 10,
        Database: 11,
        DBDuplicateEntry: 12,
        DBQuery: 13,
        DBInsert: 14,
        DBUpdate: 15,
        DBDelete: 16,
        DBInvalidDriver: 17,
        /** When query is suppose to return one record, but returns more */
        DBRecordCount: 18,
        /** When query is suppose to return some records, but returns none */
        DBNoRecord: 19,
        // acl
        Unauthorized: 401,
        Forbidden: 403,
        Client: 400,
        Server: 500,
        Token: 23,
        // logical
        WrongInput: 31,
        OperationFailed: 32,
        // form
        Validation: 41,
        //
        FileSystem: 51,
        Device: 52,
        //
        Implementation: 91,
        NoDataConnection: 92,
        Unknown: 99
    };

    public static Message = {
        [Err.Code.DBConnection]: 'err_db_conn',
        [Err.Code.Database]: 'err_db_op',
        [Err.Code.DBDuplicateEntry]: 'err_dup_entry',
        [Err.Code.DBQuery]: 'err_db_query',
        [Err.Code.DBInsert]: 'err_db_insert',
        [Err.Code.DBUpdate]: 'err_db_update',
        [Err.Code.DBDelete]: 'err_db_delete',
        [Err.Code.DBInvalidDriver]: 'err_db_driver',
        [Err.Code.DBRecordCount]: 'err_db_record_cnt',
        [Err.Code.DBNoRecord]: 'err_db_no_record',
        // acl
        [Err.Code.Unauthorized]: 'err_unauthorized',
        [Err.Code.Forbidden]: 'err_forbidden',
        [Err.Code.Client]: 'err_bad_req',
        [Err.Code.Server]: 'err_server',
        [Err.Code.Token]: 'err_token',
        // logical
        [Err.Code.WrongInput]: 'err_input',
        [Err.Code.OperationFailed]: 'err_op',
        // form
        [Err.Code.Validation]: 'err_validation',
        //
        [Err.Code.FileSystem]: 'err_file',
        [Err.Code.Device]: 'err_device',
        //
        [Err.Code.Implementation]: 'err_method_impl',
        [Err.Code.NoDataConnection]: 'err_net_conn',
        [Err.Code.Unknown]: 'err_unknown'
    };

    constructor(code: number = Err.Code.Unknown, message?: string) {
        if (!message) {
            message = Err.getErrorText(code);
        }
        this.code = code;
        this.message = message;
    }

    static getErrorText(code: number): string {
        return Err.Message[code] || Err.Message[Err.Code.Unknown];
    }

    /**
     * Cloning an Error object; e.g. for JSON.stringify
     */
    static clone(err: Error) {
        let clonedErr = new Err();
        Object.getOwnPropertyNames(err).forEach(property => clonedErr[property] = err[property]);
        return clonedErr;
    }
}
