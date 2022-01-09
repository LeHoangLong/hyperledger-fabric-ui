import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import myContainer from '../container';
import { useAppDispatch, useAppSelector } from '../hook';
import { Status } from '../models/Status';
import { setCertificates } from '../reducers/CertificateAuthorityReducer';
import { CertificateAuthorityService } from '../services/CertificateAuthorityService';
import { Symbols } from '../symbols';

export interface CertificateAuthorityPageProps {

}

let certificateAuthorityService = myContainer.get<CertificateAuthorityService>(Symbols.CERTIFICATE_AUTHORITY_SERVICE)

export const CertificateAuthorityPage = (props: CertificateAuthorityPageProps) => {
    let [showModal, setShowModal] = useState(false)
    let [certificateName, setCertificateName] = useState('')
    let [certificateUrl, setCertificateUrl] = useState('')
    let [pemFilePath, setPemFilePath] = useState('')
    let [errorString, setErrorString] = useState('')

    let certificateAuthorities = useAppSelector(state => state.certificateAuthorities.certificates)
    let certificateAuthoritiesStatus = useAppSelector(state => state.certificateAuthorities.status)

    let dispatch = useAppDispatch()

    useEffect(() => {
        const init = async () => {
            let certificates = await certificateAuthorityService.getCertificates()
            console.log(certificates)
            dispatch(setCertificates(certificates))
        }

        if (certificateAuthoritiesStatus === Status.INIT) {
            init()
        }
    }, [dispatch, certificateAuthoritiesStatus])

    function onFileSelectHandler(event: React.ChangeEvent<HTMLInputElement>) {
        let files = event.target.files
        if (files !== null) {
            if (files.length > 0) {
                setPemFilePath(files[0].path)
            }
        }
    }

    async function onNewCertificateAuthoritySubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        try {
            let newCa = await certificateAuthorityService.createCertificate({
                certifcateName: certificateName,
                certificateUrl: certificateUrl,
                certificatePath: pemFilePath,
            })
            dispatch(setCertificates([...certificateAuthorities, newCa]))
            setShowModal(false)
        } catch (exception) {
            let error = exception as Error        
            setErrorString(error.message)    
        }
    }

    function displayCertificateAuthorities() : React.ReactNode[] {
        let ret: React.ReactNode[] = []
        for (let i  = 0; i < certificateAuthorities.length; i++) {
            ret.push(
                <article key={ certificateAuthorities[i].name }>
                    <h6> { certificateAuthorities[i].name } </h6>
                    <p> { certificateAuthorities[i].url } </p>
                </article>
            )
        }

        return ret
    }

    useEffect(() => {
        let temp = document.getElementById('ca-page')
        if (temp !== null) {
            Modal.setAppElement(temp)
        }
    }, [])

    return (
        <section id='ca-page'>
            <h2>Certificate authorities</h2>
            { displayCertificateAuthorities() }
            <button onClick={() => setShowModal(true)}>Add certificate</button>
            <Modal isOpen={showModal}>
                <button onClick={() => setShowModal(false)}>&times;</button>
                <form onSubmit={ onNewCertificateAuthoritySubmit }>
                    <label htmlFor='ca-name'>
                        Name
                    </label>
                    <input id='ca-name' value={ certificateName } onChange={e => setCertificateName(e.target.value)}></input>

                    <label htmlFor='ca-url'>
                        URL
                    </label>
                    <input id='ca-url' value={ certificateUrl } onChange={e => setCertificateUrl(e.target.value)}></input>

                    <label htmlFor='ca-pem-file'>
                        PEM file
                    </label>
                    <div>
                        <input accept='.pem' type="file" id='ca-pem-file' onChange={ onFileSelectHandler }></input>
                    </div>
                    <button>Ok</button>
                </form>
                <p>{ errorString }</p>
            </Modal>
        </section>
    )
}