import { inject, injectable } from "inversify";
import { LevelUp } from "levelup";
import { AlreadyExists } from "../../common/exceptions/AlreadyExists";
import { CertificateAuthority } from "../../common/models/CertificateAuthority";
import { Symbols } from "../symbols";
import { Tables } from "../tables";
import { ICertificateAuthorityRepository } from "./ICertificateAuthorityRepository";

@injectable()
export class LevelUpCertificateAuthorityRepository implements ICertificateAuthorityRepository {
    @inject(Symbols.LEVEL_UP_DRIVER) private driver?: LevelUp

    async createCertificateAuthority(arg: {
        name: string, 
        url: string,
        pemString: string,
    }): Promise<CertificateAuthority> {
        let certificate = await this.getCertificate(arg.name)
        if (certificate !== undefined) {
            throw new AlreadyExists('Certificate with same name found')
        } else {
            let certificateAuthority = {
                name: arg.name,
                url: arg.url,
                pemString: arg.pemString,    
            }
            await this.driver!.put(`${Tables.CERTIFICATE_AUTHORITY}/${arg.name}`, JSON.stringify(certificateAuthority))
            let keys = await this.getCertificateAuthorityKeys()
            keys = [...keys, arg.name]
            await this.driver?.put(`${Tables.CERTIFICATE_AUTHORITY}_keys`, JSON.stringify(keys))
            return certificateAuthority
        }
    }

    private async getCertificateAuthorityKeys(): Promise<string[]> {
        try {
            let keys = JSON.parse(await this.driver?.get(`${Tables.CERTIFICATE_AUTHORITY}_keys`))
            return keys
        } catch (exception) {
            return []
        }
    }

    private jsonToCertificate(json: any) : CertificateAuthority {
        return {
            name: json.name,
            url: json.url,
            pemString: json.pemString,    
        }
    }

    async getCertificate(name: string) : Promise<CertificateAuthority | undefined> {
        try {
            let certificateJson = JSON.parse(await this.driver!.get(`${Tables.CERTIFICATE_AUTHORITY}/${name}`))
            return this.jsonToCertificate(certificateJson)
        } catch (exception) {
            return undefined
        }
    }


    async getCertificates() : Promise<CertificateAuthority[]> {
        let keys = await this.getCertificateAuthorityKeys()
        let ret: CertificateAuthority[] = []
        for (let i = 0; i < keys.length; i++) {
            let ca = await this.getCertificate(keys[i])
            if (ca) {
                ret.push(ca)
            }
        }
        return ret
    }


    async setSelectedCertificateAuthority(name: string) : Promise<boolean> {
        let certificate = await this.getCertificate(name)
        if (certificate !== undefined) {
            await this.driver!.put(`${Tables.CERTIFICATE_AUTHORITY}_selected`, name)
            return true
        } else {
            return false
        }
    }

    async getSelectedCertificateAuthority() : Promise<CertificateAuthority | undefined> {
        try {
            let selectedName = await this.driver!.get(`${Tables.CERTIFICATE_AUTHORITY}_selected`)
            return this.getCertificate(selectedName)
        } catch (exception) {
            return undefined
        }
    }
}