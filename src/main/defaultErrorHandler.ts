import { ErrorCode } from "../common/errorCodes"
import { AlreadyExists } from "../common/exceptions/AlreadyExists"
import { NotFound } from "../common/exceptions/NotFound"

export const defaultErrorHandler = async (fn: () => Promise<any>) => {
    try {
        return await fn()
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