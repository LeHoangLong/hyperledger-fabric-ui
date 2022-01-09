import { ipcMain } from "electron";
import { Channels } from '../../common/channels'
import myContainer from "../container";
import { Symbols } from "../symbols";
import { CertificateAuthorityView } from "../views/CertificateAuthorityView";

ipcMain.handle(Channels.ADD_CERTIFICATE_AUTHORITY, async (event, arg) => {
    let view = myContainer.get<CertificateAuthorityView>(Symbols.CERTIFICATE_AUTHORITY_VIEW)
    let result = await view.addCertificateAuthority({
        name: arg.name,
        url: arg.url,
        pemPath: arg.pemPath,
    })

    return result
})

ipcMain.handle(Channels.GET_CERTIFICATE_AUTHORITY, async (event, arg) => {
    let view = myContainer.get<CertificateAuthorityView>(Symbols.CERTIFICATE_AUTHORITY_VIEW)
    let result = await view.getCertificateAuthorities()

    return result
})

ipcMain.handle(Channels.GET_SELECTED_CERTIFICATE_AUTHORITY, async (event, arg) => {
    let view = myContainer.get<CertificateAuthorityView>(Symbols.CERTIFICATE_AUTHORITY_VIEW)
    let result = await view.getSelectedCertificateAuthority()
    return result
})

ipcMain.handle(Channels.SET_SELECTED_CERTIFICATE_AUTHORITY, async (event, arg) => {
    let view = myContainer.get<CertificateAuthorityView>(Symbols.CERTIFICATE_AUTHORITY_VIEW)
    console.log('arg')
    console.log(arg)
    let result = await view.setSelectedCertificateAuthority(arg.name)
    return result
})
