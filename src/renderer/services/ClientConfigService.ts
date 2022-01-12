import { ipcRenderer } from "electron";
import { injectable } from "inversify";
import { Channels } from "../../common/channels";
import { Result } from "../../common/models/Result";
import { defaultMainErrorHandler } from "./DefaultMainErrorHandler";

@injectable()
export class ClientConfigService {
    async saveConfig(arg: {
        path: string,
    }): Promise<Record<string, unknown>> {
        return defaultMainErrorHandler(async () => {
            return await ipcRenderer.invoke(Channels.SET_CLIENT_CONFIG, arg) as Result<Record<string, unknown>>
        })
    }

    async getConfig(): Promise<Record<string, unknown>> {
        return defaultMainErrorHandler(async () => {
            let ret = await ipcRenderer.invoke(Channels.GET_CLIENT_CONFIG) as Result<Record<string, unknown>>
            return ret
        })
    }
} 
