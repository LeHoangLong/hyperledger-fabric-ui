import { CertificateAuthorityState } from "../states/CertificateAuthorityState";
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CertificateAuthority } from "../../common/models/CertificateAuthority";
import { Status } from "../models/Status";

const initialState : CertificateAuthorityState = {
    certificates: [],
    selectedCertificateName: undefined,
    status: Status.INIT
}

let slice = createSlice({
    name: 'ca',
    initialState,
    reducers: {
        setCertificates: (state, action: PayloadAction<CertificateAuthority[]>) => {
            state.certificates = action.payload
            state.status = Status.IDLE
        },

        setSelectedCertificateName: (state, action: PayloadAction<string | undefined>) => {
            state.selectedCertificateName = action.payload
        }
    },
})

export const { setCertificates, setSelectedCertificateName } = slice.actions
export default slice.reducer