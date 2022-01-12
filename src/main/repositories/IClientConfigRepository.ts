export interface IClientConfigRepository {
    setConfig(json: unknown) : Promise<Record<string, unknown>>
    getConfig() : Promise<Record<string, unknown>>
}