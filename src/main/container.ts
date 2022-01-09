import 'reflect-metadata';
import { Container } from "inversify";
import { LevelUp } from "levelup";
import RocksDB from "rocksdb";
import { CertificateAuthorityController } from "./controllers/CertificateAuthorityController";
import { ICertificateAuthorityRepository } from "./repositories/ICertificateAuthorityRepository";
import { LevelUpCertificateAuthorityRepository } from "./repositories/LevelUpCertificateAuthorityRepository";
import { CertificateAuthorityService } from "./services/CertificateAuthorityService";
import { Symbols } from "./symbols";
import { CertificateAuthorityView } from "./views/CertificateAuthorityView";
import fs from 'fs'
import path from 'path';
const levelup = require('levelup')
const homedir = require('os').homedir();

export const myContainer = new Container()


myContainer.bind<CertificateAuthorityController>(Symbols.CERTIFICATE_AUTHORITY_CONTROLLER).to(CertificateAuthorityController)
myContainer.bind<CertificateAuthorityView>(Symbols.CERTIFICATE_AUTHORITY_VIEW).to(CertificateAuthorityView)
myContainer.bind<CertificateAuthorityService>(Symbols.CERTIFICATE_AUTHORITY_SERVICE).to(CertificateAuthorityService)
myContainer.bind<ICertificateAuthorityRepository>(Symbols.CERTIFICATE_AUTHORITY_REPOSITORY).to(LevelUpCertificateAuthorityRepository)

let dataPath = path.join(homedir, '.hyperledger-ui-data')
if (!fs.existsSync(dataPath)){
    fs.mkdirSync(dataPath);
}

let rocksDb = new RocksDB(`${dataPath}/rocksdb`)
let levelUpDriver = levelup(rocksDb)
myContainer.bind<LevelUp<RocksDB>>(Symbols.LEVEL_UP_DRIVER).toConstantValue(levelUpDriver)

export default myContainer