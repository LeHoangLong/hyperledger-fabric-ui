import { Status } from "../models/Status";

export interface ClientConfigState {
    config: Record<string, unknown>
    status: Status
}