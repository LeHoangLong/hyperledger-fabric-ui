import { CertificateAuthority } from "../../common/models/CertificateAuthority";
import { ipcRenderer } from "electron";
import { Channels } from "../../common/channels";
import { injectable } from "inversify";
import { Result } from "../../common/models/Result";
import { defaultMainErrorHandler } from "./DefaultMainErrorHandler";

@injectable()
export class CertificateAuthorityService {
    async createCertificate(arg: {
        certifcateName: string,
        certificateUrl: string,
        certificatePath: string
    }): Promise<CertificateAuthority> {
        return defaultMainErrorHandler(async () => {
            return await ipcRenderer.invoke(Channels.ADD_CERTIFICATE_AUTHORITY, {
                name: arg.certifcateName,
                url: arg.certificateUrl,
                pemPath: arg.certificatePath,
            }) as Result<CertificateAuthority>
        })
    }

    async getCertificates() : Promise<CertificateAuthority[]> {
        return defaultMainErrorHandler(async () => {
            return await ipcRenderer.invoke(Channels.GET_CERTIFICATE_AUTHORITY) as Result<CertificateAuthority[]>
        })
    }
}