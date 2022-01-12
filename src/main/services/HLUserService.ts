import { Identity, Wallet } from 'fabric-network'
import { inject, injectable } from 'inversify';
import FabricCAServices from 'fabric-ca-client';
import { Symbols } from '../symbols';
import { IUserService } from './IUserService';
import { HLCaServiceClientBuilder } from '../builders/HLCaServiceClientBuilder';
import { NotFound } from '../../common/exceptions/NotFound';
import { IUserRepository } from '../repositories/IUserRepository';

@injectable()
export class HLUserService implements IUserService {
    @inject(Symbols.HYPERLEDGER_WALLET) 
    private wallet?: Wallet

    @inject(Symbols.HYPERLEDGER_CA_CLIENT_BUILDER)
    private builder?: HLCaServiceClientBuilder

    @inject(Symbols.USER_REPOSITORY)
    private repository?: IUserRepository

    async getIdentity(username: string) : Promise<Identity | undefined> {
        return this.wallet!.get(username)
    }

    async enrollUser(arg: {
        username: string, 
        password: string, 
        affiliation: string
    }) : Promise<Identity> {
        let client = await this.builder!.buildClient()
        if (client) {
            let currentUsername = await this.repository!.getCurrentUserName()
            let currentUserIdentity = await this.getIdentity(currentUsername)

            if (currentUserIdentity !== undefined) {
                const provider = this.wallet!.getProviderRegistry().getProvider(currentUserIdentity.type);
                const adminUser = await provider.getUserContext(currentUserIdentity, currentUsername);

                const secret = await client.register({
                    affiliation: arg.affiliation,
                    enrollmentID: arg.username,
                    role: 'client'
                }, adminUser);

                const enrollment = await client.enroll({
                    enrollmentID: arg.username,
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
                await this.wallet!.put(arg.username, x509Identity);
                return (await this.wallet!.get(arg.username))!
            } else {
                throw new NotFound('Current user is not admin')
            }
        } else {
            throw new NotFound('No Certificate Authority selected')
        }
    }

    async enrollAdmin(arg: {username: string, password: string}) : Promise<Identity> {
        let client = await this.builder?.buildClient()
        if (client) {
            const enrollment = await client.enroll({ 
                enrollmentID: arg.username, 
                enrollmentSecret: arg.password 
            });
            const x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: 'Org1MSP',
                type: 'X.509',
            };
            await this.wallet!.put(arg.username, x509Identity);
            let identity = await this.wallet!.get(arg.username);
            return identity!
        } else {
            throw new NotFound('No Certificate Authority selected')
        }
    }
}