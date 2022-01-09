import { ErrorCode } from "../../common/errorCodes";
import { AlreadyExists } from "../../common/exceptions/AlreadyExists";
import { NotFound } from "../../common/exceptions/NotFound";
import { Result } from "../../common/models/Result";

export const defaultMainErrorHandler = async (fn: () => Promise<Result<any>>) : Promise<any> => {
    let result = await fn()
    if (result.errorCode === ErrorCode.SUCCESS) {
        return result.data
    } else if (result.errorCode === ErrorCode.NOT_FOUND) {
        throw new NotFound(result.errorMessage)
    } else if (result.errorCode === ErrorCode.ALREADY_EXISTS) { 
        throw new AlreadyExists(result.errorMessage)
    } else {
        throw new Error(result.errorMessage)
    }
}