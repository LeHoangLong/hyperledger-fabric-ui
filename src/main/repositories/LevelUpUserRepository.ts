import { inject, injectable } from "inversify";
import { LevelUp } from "levelup";
import { AlreadyExists } from "../../common/exceptions/AlreadyExists";
import { NotFound } from "../../common/exceptions/NotFound";
import { User } from "../../common/models/User";
import { IPasswordHasher } from "../services/IPasswordHasher";
import { Symbols } from "../symbols";
import { Tables } from "../tables";
import { IUserRepository } from "./IUserRepository";

@injectable()
export class LevelUpUserRepository implements IUserRepository {
    @inject(Symbols.LEVEL_UP_DRIVER) 
    private driver?: LevelUp

    @inject(Symbols.PASSWORD_HASHER)
    private hasher?: IPasswordHasher

    private async isUsernameTaken(username: string) : Promise<boolean> {
        try {
            await this.driver!.get(`${Tables.USER}/${username}`)
            return true
        } catch (exception) {
            return false
        }
    }

    async addUser(username: string, password: string) : Promise<User> {
        let user: User | undefined
        let isUsernameTaken = await this.isUsernameTaken(username)

        if (isUsernameTaken) {
            throw new AlreadyExists(`User with username ${username} already exists`)
        } else {
            let hash = await this.hasher!.hash(password)
            user = {
                username: username,
                passwordHash: hash,
            }
            await this.driver!.put(`${Tables.USER}/${username}`, JSON.stringify(user))
            return user
        }
    }

    async setCurrentUser(username: string, password: string): Promise<User> {
        let user: User | undefined
        try {
            user = await this.getUser(username, password)
        } catch (exception) {
            // Do nothing
        }

        if (user !== undefined) {
            await this.driver!.put(`${Tables.USER}_current`, username)
            return user
        } else {
            throw new NotFound(`User with username ${username} not found or incorrect password`)
        }
        
    }

    async getUser(username: string, password: string): Promise<User> {
        let userJson: string
        try {
            userJson = await this.driver!.get(`${Tables.USER}/${username}`)
        } catch (exception) {
            throw new NotFound(`user with username ${username} not found or incorrect password`)
        }

        let user = JSON.parse(userJson) as User
        if ((await this.hasher?.check(password, user.passwordHash))) {
            return user
        } else {
            throw new NotFound(`user with username ${username} not found or incorrect password`)
        }
    }

    async getCurrentUserName(): Promise<string> {
        let username: string
        try {
            username = await this.driver!.get(`${Tables.USER}_current`)
        } catch (exception) {
            throw new NotFound('No current user')
        }

        let userJson = await this.driver!.get(`${Tables.USER}/${username}`)
        let user = JSON.parse(userJson) as User
        return user.username
    }
}