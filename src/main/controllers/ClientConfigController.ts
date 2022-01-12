import { inject, injectable } from "inversify";
import { IClientConfigRepository } from "../repositories/IClientConfigRepository";
import { Symbols } from "../symbols";
import fs from 'fs'
import { NotFound } from "../../common/exceptions/NotFound";

@injectable()
export class ClientConfigController {
    @inject(Symbols.CLIENT_CONFIG_REPOSITORY)
    private repository?: IClientConfigRepository


    getConfig() : Promise<Record<string, unknown>> {
        return this.repository!.getConfig()
    }

    async setConfig(path: string) : Promise<Record<string, unknown>> {
        if (!(await fs.existsSync(path))) {
            throw new NotFound('File not found')
        }
        let config = await new Promise<string>((resolve, reject) => {
            fs.readFile(path, {
                encoding: 'utf-8'
            }, (error, data) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(data)
                }
            })
        })
        return this.repository!.setConfig(JSON.parse(config))
    }
}