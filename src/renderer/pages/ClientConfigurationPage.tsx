import { useEffect, useState } from "react"
import myContainer from "../container"
import {  useAppDispatch, useAppSelector } from "../hook"
import { Status } from "../models/Status"
import { setConfig } from "../reducers/ClientConfigReducer"
import { ClientConfigService } from "../services/ClientConfigService"
import { Symbols } from "../symbols"

export const ClientConfigurationPage = () => {
    let config = useAppSelector(state => state.clientConfig.config)
    let configStatus = useAppSelector(state => state.clientConfig.status)
    let dispatch = useAppDispatch()
    let [configPath, setConfigPath] = useState('')

    async function onFormSubmitHandler(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        let service = myContainer.get<ClientConfigService>(Symbols.CLIENT_CONFIGURATION_SERVICE)
        let config = await service.saveConfig({path: configPath})
        dispatch(setConfig(config))
    }

    useEffect(() => {
        async function init() {
            let service = myContainer.get<ClientConfigService>(Symbols.CLIENT_CONFIGURATION_SERVICE)
            let config = await service.getConfig()
            dispatch(setConfig(config))
        }

        if (configStatus === Status.INIT) {
            init()
        }
    }, [configStatus, dispatch])

    function onConfigPathSaveHandler(event: React.ChangeEvent<HTMLInputElement>) {
        let files = event.target.files
        if (files) {
            if (files.length > 0) {
                setConfigPath(files[0].path)
            }
        }
    }

    return <section>
        <form onSubmit={ onFormSubmitHandler }>
            <input type="file" accept=".json" onChange={ onConfigPathSaveHandler }></input>
            <button formAction="submit">Save</button>
        </form>
        <article>
            <pre>
                { JSON.stringify(config, null, 2) }
            </pre>
        </article>
    </section>
}