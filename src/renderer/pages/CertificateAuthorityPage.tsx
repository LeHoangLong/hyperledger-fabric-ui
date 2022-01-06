import { useState } from 'react';
import Modal from 'react-modal';

export interface CertificateAuthorityPageProps {

}

export const CertificateAuthorityPage = (props: CertificateAuthorityPageProps) => {
    let [showModal, setShowModal] = useState(false)

    return (
        <section>
            <h2>Certificate authorities</h2>
            <button onClick={() => setShowModal(true)}>Add certificate</button>
            <Modal isOpen={showModal}>
                <button onClick={() => setShowModal(false)}>&times;</button>
                <form>
                    <label htmlFor='ca-name'>
                        Name
                    </label>
                    <input id='ca-name'></input>

                    <label htmlFor='ca-url'>
                        URL
                    </label>
                    <input id='ca-url'></input>

                    <label htmlFor='ca-pem-file'>
                        PEM file
                    </label>
                    <input type="file" id='ca-pem-file'></input>
                </form>
            </Modal>
        </section>
    )
}