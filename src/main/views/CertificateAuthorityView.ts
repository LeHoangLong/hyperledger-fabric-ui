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


    async getCertificateAuthorities() : Promise<Result<CertificateAuthority[]>>  {
        let certificates = await defaultErrorHandler(async () => {
            return await this.controller!.getCertificateAuthorities()
        })
        return {
            data: certificates,
            errorCode: ErrorCode.SUCCESS
        }
    }

    async addCertificateAuthority(arg: {
        name: string,
        url: string,
        pemPath: string,
    }) : Promise<Result<CertificateAuthority>> {
        return defaultErrorHandler(async () => {
            let certificate = await this.controller!.addCertificateAuthority({
                name: arg.name,
                url: arg.url,
                pemPath: arg.pemPath,
            })

            return {
                data: certificate,
                errorCode: ErrorCode.SUCCESS,
            }
        })
    }
}