import 'reflect-metadata';
import { Container } from "inversify";
import { LevelUp } from "levelup";
import RocksDB from "rocksdb";
import { CertificateAuthorityController } from "./controllers/CertificateAuthorityController";
import { ICertificateAuthorityRepository } from "./repositories/ICertificateAuthorityRepository";
import { LevelUpCertificateAuthorityRepository } from "./repositories/LevelUpCertificateAuthorityRepository";
import { Symbols } from "./symbols";
import { CertificateAuthorityView } from "./views/CertificateAuthorityView";
import fs from 'fs'
import path from 'path';
import { ClientConfigView } from './views/ClientConfigView';
import { ClientConfigController } from './controllers/ClientConfigController';
import { IClientConfigRepository } from './repositories/IClientConfigRepository';
import { LevelUpClientConfigRepository } from './repositories/LevelUpClientConfigRepository';
const levelup = require('levelup')
const homedir = require('os').homedir();

export const myContainer = new Container()


myContainer.bind<CertificateAuthorityController>(Symbols.CERTIFICATE_AUTHORITY_CONTROLLER).to(CertificateAuthorityController)
myContainer.bind<CertificateAuthorityView>(Symbols.CERTIFICATE_AUTHORITY_VIEW).to(CertificateAuthorityView)
myContainer.bind<ICertificateAuthorityRepository>(Symbols.CERTIFICATE_AUTHORITY_REPOSITORY).to(LevelUpCertificateAuthorityRepository)

myContainer.bind<ClientConfigView>(Symbols.CLIENT_CONFIG_VIEW).to(ClientConfigView)
myContainer.bind<ClientConfigController>(Symbols.CLIENT_CONFIG_CONTROLLER).to(ClientConfigController)
myContainer.bind<IClientConfigRepository>(Symbols.CLIENT_CONFIG_REPOSITORY).to(LevelUpClientConfigRepository)


let dataPath = path.join(homedir, '.hyperledger-ui-data')
if (!fs.existsSync(dataPath)){
    fs.mkdirSync(dataPath);
}

let rocksDb = new RocksDB(`${dataPath}/rocksdb`)
let levelUpDriver = levelup(rocksDb)
myContainer.bind<LevelUp<RocksDB>>(Symbols.LEVEL_UP_DRIVER).toConstantValue(levelUpDriver)

export default myContainer