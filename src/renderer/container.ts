import 'reflect-metadata';
import { Container } from "inversify";
import { CertificateAuthorityService } from "./services/CertificateAuthorityService";
import { Symbols } from "./symbols";

const myContainer = new Container()

myContainer.bind<CertificateAuthorityService>(Symbols.CERTIFICATE_AUTHORITY_SERVICE).to(CertificateAuthorityService)

export default myContainer
