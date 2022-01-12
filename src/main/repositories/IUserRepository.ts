import { User } from "../../common/models/User";

export interface IUserRepository {
    // Throw AlreadyExists if username already exists
    addUser(username: string, password: string) : Promise<User>
    // Throw NotFound if username not found or password does not match
    getUser(username: string, password: string): Promise<User>
    // Throw NotFound if username not found or password does not match
    setCurrentUser(username: string, password: string): Promise<User>
    // Throw NotFound if no current user
    getCurrentUserName(): Promise<string>
}