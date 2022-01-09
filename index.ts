import { Gateway, Wallets } from "fabric-network"
import FabricCAServices from 'fabric-ca-client';
import fs from 'fs'
import YAML from 'yaml'

console.log('hello')

const file = fs.readFileSync('./profile.yaml', 'utf8')
let connectionProfile = YAML.parse(file)

let gateway = new Gateway()

async function testGateway() {
    try {
        let wallet = await Wallets.newFileSystemWallet('./wallet');

        let adminUserId = 'admin'
        let adminUserPasswd = 'adminpw'
		let adminIdentity = await wallet.get(adminUserId);
        if (!adminIdentity) {
            let caCert = fs.readFileSync('./ca.pem', 'utf-8')
            const caUrl = 'https://localhost:7054"'
            const caName = 'ca-org1'
            const caClient = new FabricCAServices(caUrl, { 
                trustedRoots: [caCert], 
                verify: false, 
            }, caName);
            const enrollment = await caClient.enroll({ 
                enrollmentID: adminUserId, 
                enrollmentSecret: adminUserPasswd 
            });
            const x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: 'Org1MSP',
                type: 'X.509',
            };
            await wallet.put(adminUserId, x509Identity);
            adminIdentity = await wallet.get(adminUserId);
        }
		
        let org1UserId = 'appUser'
		let userIdentity = await wallet.get(org1UserId);
        if (!userIdentity) {
            let caCert = fs.readFileSync('./ca.pem', 'utf-8')
            const caUrl = 'https://localhost:7054"'
            const caName = 'ca-org1'
            const caClient = new FabricCAServices(caUrl, { 
                trustedRoots: [caCert], 
                verify: false 
            }, caName);

            const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
            const adminUser = await provider.getUserContext(adminIdentity, adminUserId);
            let affiliation = 'org1.department1'
            const secret = await caClient.register({
                affiliation: affiliation,
                enrollmentID: org1UserId,
                role: 'client'
            }, adminUser);

            const enrollment = await caClient.enroll({
                enrollmentID: org1UserId,
                enrollmentSecret: secret
            });
            const x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: 'Org1MSP',
                type: 'X.509',
            };
            await wallet.put(org1UserId, x509Identity);
        }

        await gateway.connect(connectionProfile, {
            identity: org1UserId,
            wallet: wallet,
            discovery: { enabled: true, asLocalhost: true },
        })
    } catch (error) {
        console.log('error')
        console.log(error)
    } finally {
        gateway.disconnect();
    }
}

testGateway()