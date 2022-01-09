import { CertificateAuthority } from "../../common/models/CertificateAuthority";
import { Status } from "../models/Status";

export interface CertificateAuthorityState {
    certificates: CertificateAuthority[],
    selectedCertificateName: string | undefined,
    status: Status,
}