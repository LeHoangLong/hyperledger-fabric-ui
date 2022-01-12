import { Identity } from "fabric-network";

export interface IUserService {
    // return undefined if no username
    getIdentity(username: string) : Promise<Identity | undefined>;
    enrollAdmin(arg: {username: string, password: string}) : Promise<Identity>
    enrollUser(arg: {username: string, password: string}) : Promise<Identity>
}