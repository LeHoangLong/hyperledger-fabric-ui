import { ErrorCode } from "../common/errorCodes"
import { AlreadyExists } from "../common/exceptions/AlreadyExists"
import { NotFound } from "../common/exceptions/NotFound"
import { Result } from "../common/models/Result"

export const defaultErrorHandler = async <T extends unknown>(fn: () => Promise<T>) : Promise<Result<T>> => {
    try {
        let ret = await fn()
        return {
            data: ret,
            errorCode: ErrorCode.SUCCESS,
        }
    } catch (exception) {
        if (exception instanceof NotFound) {
            return {
                errorCode: ErrorCode.NOT_FOUND,
                errorMessage: exception.message,
            }
        } else if (exception instanceof AlreadyExists) {
            return {
                errorCode: ErrorCode.ALREADY_EXISTS,
                errorMessage: exception.message,
            }
        } else if (exception instanceof Error) {
            return {
                errorCode: ErrorCode.UNKNOWN,
                errorMessage: exception.message,
            }
        } else {
            return {
                errorCode: ErrorCode.UNKNOWN,
                errorMessage: JSON.stringify(exception),
            }
        }
    }
}