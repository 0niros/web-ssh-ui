export class CommonResponse<T> {
    errorCode: number;
    message: string;
    result: T;

    constructor(code: number, msg: string, result: T) {
        this.message = msg
        this.errorCode = code
        this.result = result
    }

}