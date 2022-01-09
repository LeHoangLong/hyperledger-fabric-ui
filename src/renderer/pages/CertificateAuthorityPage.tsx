import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { NotFound } from '../../common/exceptions/NotFound';
import myContainer from '../container';
import { useAppDispatch, useAppSelector } from '../hook';
import { Status } from '../models/Status';
import { setCertificates, setSelectedCertificateName } from '../reducers/CertificateAuthorityReducer';
import { CertificateAuthorityService } from '../services/CertificateAuthorityService';
import { Symbols } from '../symbols';
import fontawesome from '@fortawesome/fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTrash } from '@fortawesome/fontawesome-free-solid'
import { CertificateAuthority } from '../../common/models/CertificateAuthority';

export interface CertificateAuthorityPageProps {

}

fontawesome.library.add(faCheck, faTrash);

let certificateAuthorityService = myContainer.get<CertificateAuthorityService>(Symbols.CERTIFICATE_AUTHORITY_SERVICE)

export const CertificateAuthorityPage = (props: CertificateAuthorityPageProps) => {
    let [showModal, setShowModal] = useState(false)
    let [certificateName, setCertificateName] = useState('')
    let [certificateUrl, setCertificateUrl] = useState('')
    let [pemFilePath, setPemFilePath] = useState('')
    let [modalErrorString, setModalErrorString] = useState('')
    let [errorString, setErrorString] = useState('')

    let certificateAuthorities = useAppSelector(state => state.certificateAuthorities.certificates)
    let certificateAuthoritiesStatus = useAppSelector(state => state.certificateAuthorities.status)
    let selectedCertificateName = useAppSelector(state => state.certificateAuthorities.selectedCertificateName)

    let dispatch = useAppDispatch()

    useEffect(() => {
        const init = async () => {
            let certificates = await certificateAuthorityService.getCertificates()
            dispatch(setCertificates(certificates))

            try {
                let selectedCertificateName =  await certificateAuthorityService.getSelectedCertificates()
                dispatch(setSelectedCertificateName(selectedCertificateName.name))
            } catch (exception) {
                if (exception instanceof NotFound) {
                    // Do nothing
                } else {
                    console.log('set error')
                    setModalErrorString((exception as Error).message)
                }
            }
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
            console.log('set error')    
            setModalErrorString(error.message)    
        }
    }

    async function onCaClicked(ca: CertificateAuthority) {
        try {
            let selected = await certificateAuthorityService.setSelectedCertificates(ca.name)
            dispatch(setSelectedCertificateName(selected.name))
        } catch (exception) {
            setErrorString((exception as Error).message)
        }
    }

    function displayCertificateAuthorities() : React.ReactNode[] {
        let ret: React.ReactNode[] = []
        for (let i  = 0; i < certificateAuthorities.length; i++) {
            let isSelected = certificateAuthorities[i].name === selectedCertificateName
            ret.push(
                <article key={ certificateAuthorities[i].name }>
                    <button onClick={() => onCaClicked(certificateAuthorities[i]) }>
                        {(() => {
                            if (isSelected) {
                                return <FontAwesomeIcon icon={["fas", "check"]} />
                            }
                        })()}
                        <h6> { certificateAuthorities[i].name } </h6>
                        <p> { certificateAuthorities[i].url } </p>
                    </button>
                    <button>
                        <FontAwesomeIcon icon="trash"></FontAwesomeIcon>
                    </button>
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
            <p>{ errorString }</p>
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
                <p>{ modalErrorString }</p>
            </Modal>
        </section>
    )
}