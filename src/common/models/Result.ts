export interface Result<T> {
    data?: T,
    errorCode: number,
    errorMessage?: string,
}