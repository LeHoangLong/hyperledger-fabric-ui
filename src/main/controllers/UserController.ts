import { Identity } from "fabric-network";
import { inject, injectable } from "inversify";
import { AlreadyExists } from "../../common/exceptions/AlreadyExists";
import { User } from "../../common/models/User";
import { IUserRepository } from "../repositories/IUserRepository";
import { IPasswordHasher } from "../services/IPasswordHasher";
import { IUserService } from "../services/IUserService";
import { Symbols } from "../symbols";

@injectable()
export class UserController {
    @inject(Symbols.USER_REPOSITORY)
    private repository?: IUserRepository

    @inject(Symbols.USER_SERVICE)
    private service?: IUserService

    async createUser(arg: {
        username: string,
        password: string,
    }): Promise<User> {
        return this.repository!.addUser(arg.username, arg.password)
    }

    async enrollAdmin(arg: {
        username: string,
        password: string,
    }) : Promise<Identity> {
        let storedUser = await this.repository!.getUser(arg.username, arg.password)

        let identity = await this.service?.getIdentity(storedUser.username)
        if (!identity) {
            throw new AlreadyExists(`User with name ${arg.username} already registered`)
        } else {
            return await this.service!.enrollAdmin({
                username: arg.username,
                password: arg.password,
            })
        }
    }
}