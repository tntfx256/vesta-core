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
        [Err.Code.DBConnection]: 'Database Connection Error',
        [Err.Code.Database]: 'Database Operation Error',
        [Err.Code.DBDuplicateEntry]: 'Database Duplicate Entry Error',
        [Err.Code.DBQuery]: 'Database Query Error',
        [Err.Code.DBInsert]: 'Database Insertion Error',
        [Err.Code.DBUpdate]: 'Database Update Entry Error',
        [Err.Code.DBDelete]: 'Database Delete Entry Error',
        [Err.Code.DBInvalidDriver]: 'Database Invalid Driver',
        [Err.Code.DBRecordCount]: 'Database Records Count Error',
        [Err.Code.DBNoRecord]: 'Database No Record Found',
        // acl
        [Err.Code.Unauthorized]: 'Unauthorized',
        [Err.Code.Forbidden]: 'Forbidden',
        [Err.Code.Client]: 'Bad Request',
        [Err.Code.Server]: 'Internal Server Error',
        [Err.Code.Token]: 'Invalid Token',
        // logical
        [Err.Code.WrongInput]: 'Wrong Input',
        [Err.Code.OperationFailed]: 'Operation Failed',
        // form
        [Err.Code.Validation]: 'Invalid Data',
        //
        [Err.Code.FileSystem]: 'File Operation Error',
        [Err.Code.Device]: '',
        //
        [Err.Code.Implementation]: 'Method Is Not Implemented',
        [Err.Code.NoDataConnection]: 'No Network Connection',
        [Err.Code.Unknown]: 'Unknown Error'
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
