import { ipcMain } from "electron";
import { Channels } from '../../common/channels'
import myContainer from "../container";
import { Symbols } from "../symbols";
import { ClientConfigView } from "../views/ClientConfigView";

ipcMain.handle(Channels.SET_CLIENT_CONFIG, async (event, arg) => {
    let view = myContainer.get<ClientConfigView>(Symbols.CLIENT_CONFIG_VIEW)
    let result = await view.setConfig(arg.path)

    return result
})

ipcMain.handle(Channels.GET_CLIENT_CONFIG, async (event, arg) => {
    let view = myContainer.get<ClientConfigView>(Symbols.CLIENT_CONFIG_VIEW)
    let result = await view.getConfig()

    return result
})
