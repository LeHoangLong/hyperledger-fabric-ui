import { inject, injectable } from "inversify";
import { LevelUp } from "levelup";
import { Symbols } from "../symbols";
import { Tables } from "../tables";
import { IClientConfigRepository } from "./IClientConfigRepository";

@injectable()
export class LevelUpClientConfigRepository implements IClientConfigRepository {
    @inject(Symbols.LEVEL_UP_DRIVER) 
    private driver?: LevelUp


    async setConfig(json: unknown) : Promise<Record<string, unknown>> {
        console.log('set config')
        await this.driver!.put(Tables.CLIENT_CONFIG, JSON.stringify(json))
        return this.getConfig()
    }

    async getConfig() : Promise<Record<string, unknown>> {
        try {
            let config = await this.driver!.get(Tables.CLIENT_CONFIG)
            console.log('config')
            console.log(typeof(config))
            console.log(config)
            return JSON.parse(config)
        } catch (exception) {
            return {}
        }
    }
}