import axios, {AxiosResponse} from "axios";
import {createBrowserHistory} from 'history'

const http = axios.create({
    baseURL: window.location.protocol + "//" + window.location.host,
    timeout: 5000,
})
const tokenKey = "webssh-token"

http.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
        config.headers.Authorization = `${token}`
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

http.interceptors.response.use((response: AxiosResponse) => {
    return response
}, (error) => {
    if (error.response.status === 401 || error.response.status === 400) {
        let history = createBrowserHistory()
        history.push("#/login")
    }
    return Promise.reject(error)
})

const getToken = (): string => {
    return window.localStorage.getItem(tokenKey) || ""
}

const setToken = (t: string)=> {
    window.localStorage.setItem(tokenKey, t)
}

const getServerAddressAndPort = () => {
    return window.location.host;
}

const getServerProtocol = () => {
    return window.location.protocol;
}

const getServerWsProto = () => {
    if (window.location.protocol === "http:") {
        return "ws:"
    } else {
        return "wss:"
    }
}

export {http, getToken, setToken, getServerAddressAndPort, getServerProtocol, getServerWsProto}