import { url } from "inspector";
import { inject, injectable } from "inversify";
import { CertificateAuthority } from "../../common/models/CertificateAuthority";
import { ICertificateAuthorityRepository } from "../repositories/ICertificateAuthorityRepository";
import { Symbols } from "../symbols";
import fs from 'fs'
import { NotFound } from "../../common/exceptions/NotFound";

@injectable()
export class CertificateAuthorityController {
    @inject(Symbols.CERTIFICATE_AUTHORITY_REPOSITORY) 
    private repository?: ICertificateAuthorityRepository

    async getCertificateAuthorities() : Promise<CertificateAuthority[]> {
        return this.repository!.getCertificates()
    }

    async getSelectedCertificateAuthority() : Promise<CertificateAuthority> {
        let selectedCa = await this.repository!.getSelectedCertificateAuthority()
        if (selectedCa === undefined) {
            throw new NotFound('No CA selected')
        } else {
            return selectedCa
        }
    }

    async setSelectedCertificateAuthority(name: string) : Promise<void> {
        if (!(await this.repository!.setSelectedCertificateAuthority(name))) {
            throw new NotFound(`No CA with name ${name} found`)            
        }
    }

    async addCertificateAuthority(arg: {
        name: string,
        url: string,
        pemPath: string,
    }) : Promise<CertificateAuthority> {
        if (!(await fs.existsSync(arg.pemPath))) {
            throw new NotFound('File not found')
        }
        let pemString = await fs.readFileSync(arg.pemPath, {
            encoding: 'utf-8'
        })
        return this.repository!.createCertificateAuthority({
            name: arg.name,
            url: arg.url,
            pemString,
        })
    }
}