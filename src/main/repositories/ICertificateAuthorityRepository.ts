import 'reflect-metadata';
import { CertificateAuthority } from "../../common/models/CertificateAuthority";

export interface ICertificateAuthorityRepository {
    // throw DuplicateResource if name already exists
    createCertificateAuthority(arg: {
        name: string, 
        url: string,
        pemString: string,
    }): Promise<CertificateAuthority>

    getCertificate(name: string) : Promise<CertificateAuthority | undefined>
    getCertificates() : Promise<CertificateAuthority[]>

    // return false if name is not found
    setSelectedCertificateAuthority(name: string) : Promise<boolean>
    // return undefined if no CA is selected
    getSelectedCertificateAuthority() : Promise<CertificateAuthority | undefined>
}