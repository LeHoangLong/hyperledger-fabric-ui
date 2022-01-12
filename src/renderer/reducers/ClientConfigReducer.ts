import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Status } from '../models/Status';
import { ClientConfigState } from "../states/ClientConfigState";

const initialState : ClientConfigState = {
    config: {},
    status: Status.INIT,
}

let slice = createSlice({
    name: 'cc',
    initialState,
    reducers: {
        setConfig: (state, action: PayloadAction<Record<string, unknown>>) => {
            state.status = Status.IDLE
            state.config = action.payload
        },
    },
})

export const { setConfig } = slice.actions
export default slice.reducer