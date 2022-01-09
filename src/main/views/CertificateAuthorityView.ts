import { inject, injectable } from "inversify";
import { ErrorCode } from "../../common/errorCodes";
import { AlreadyExists } from "../../common/exceptions/AlreadyExists";
import { NotFound } from "../../common/exceptions/NotFound";
import { CertificateAuthority } from "../../common/models/CertificateAuthority";
import { Result } from "../../common/models/Result";
import { CertificateAuthorityController } from "../controllers/CertificateAuthorityController";
import { defaultErrorHandler } from "../defaultErrorHandler";
import { Symbols } from "../symbols";

@injectable()
export class CertificateAuthorityView {
    @inject(Symbols.CERTIFICATE_AUTHORITY_CONTROLLER) 
    private controller?: CertificateAuthorityController

    async getSelectedCertificateAuthority() : Promise<Result<CertificateAuthority>> {
        return defaultErrorHandler<CertificateAuthority>(async () => {
            return this.controller!.getSelectedCertificateAuthority()
        })
    }

    async setSelectedCertificateAuthority(name: string) : Promise<Result<CertificateAuthority>> {
        let ret = await defaultErrorHandler(async () => {
            await this.controller!.setSelectedCertificateAuthority(name)
            return this.controller!.getSelectedCertificateAuthority()
        })

        return ret
    }

    async getCertificateAuthorities() : Promise<Result<CertificateAuthority[]>>  {
        return await defaultErrorHandler<CertificateAuthority[]>(async () => {
            return await this.controller!.getCertificateAuthorities()
        })
    }

    async addCertificateAuthority(arg: {
        name: string,
        url: string,
        pemPath: string,
    }) : Promise<Result<CertificateAuthority>> {
        return defaultErrorHandler<CertificateAuthority>(async () => {
            return await this.controller!.addCertificateAuthority({
                name: arg.name,
                url: arg.url,
                pemPath: arg.pemPath,
            })
        })
    }
}