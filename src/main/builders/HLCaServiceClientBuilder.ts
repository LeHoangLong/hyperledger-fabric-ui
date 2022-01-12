import FabricCAServices from "fabric-ca-client";
import { inject, injectable } from "inversify";
import { ICertificateAuthorityRepository } from "../repositories/ICertificateAuthorityRepository";
import { Symbols } from "../symbols";

@injectable()
export class HLCaServiceClientBuilder {
    @inject(Symbols.CERTIFICATE_AUTHORITY_REPOSITORY)
    private caRepository?: ICertificateAuthorityRepository

    // Returns undefined if no CA selected
    async buildClient(): Promise<FabricCAServices | undefined> {
        let ca = await this.caRepository?.getSelectedCertificateAuthority()
        if (ca !== undefined) {
            const caClient = new FabricCAServices(ca.url, { 
                trustedRoots: [ca.pemString], 
                verify: process.env.NODE_ENV !== 'development', 
            }, ca.name);

            return caClient
        } else{
            return undefined
        }
    }
}