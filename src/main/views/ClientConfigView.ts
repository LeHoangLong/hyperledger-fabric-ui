import { inject, injectable } from "inversify";
import { Result } from "../../common/models/Result";
import { ClientConfigController } from "../controllers/ClientConfigController";
import { defaultErrorHandler } from "../defaultErrorHandler";
import { Symbols } from "../symbols";

@injectable()
export class ClientConfigView {
    @inject(Symbols.CLIENT_CONFIG_CONTROLLER) 
    private controller?: ClientConfigController


    getConfig() : Promise<Result<Record<string, unknown>>> {
        return defaultErrorHandler<Record<string, unknown>>(async () => {
            let config = await this.controller!.getConfig()
            console.log('typeof(config)')
            console.log(typeof(config))
            return config
        }) 
    }

    setConfig(path: string) : Promise<Result<Record<string, unknown>>> {
        return defaultErrorHandler<Record<string, unknown>>(async () => {
            return this.controller!.setConfig(path)
        }) 
    }
}