import 'reflect-metadata';
import { Container } from "inversify";
import { CertificateAuthorityService } from "./services/CertificateAuthorityService";
import { Symbols } from "./symbols";
import { ClientConfigService } from './services/ClientConfigService';

const myContainer = new Container()

myContainer.bind<CertificateAuthorityService>(Symbols.CERTIFICATE_AUTHORITY_SERVICE).to(CertificateAuthorityService)
myContainer.bind<ClientConfigService>(Symbols.CLIENT_CONFIGURATION_SERVICE).to(ClientConfigService)

export default myContainer
