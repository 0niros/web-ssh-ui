import {getToken, http, setToken} from "../utils/http";
import {makeAutoObservable} from "mobx";
import {AxiosResponse} from "axios";
import {CommonResponse} from "../utils/response";

const LOGIN_API: string = "/webssh/v1/auth/login"

class LoginResponse {
    token: string

    constructor(token: string) {
        this.token = token
    }

}

class LoginStore {

    token = getToken() || ''

    constructor() {
        makeAutoObservable(this)
    }

    login = async (auth: string, remember: boolean): Promise<boolean> => {
        let status = false
        await http.post(LOGIN_API, {
            authKey: auth
        }).then((resp: AxiosResponse<CommonResponse<LoginResponse>>) => {
            // console.log(resp.data)
            console.log(resp.data.result.token)
            if (resp.data.result.token == null || resp.data.result.token === "") {
                status = false
                return
            }
            this.token = resp.data.result.token
            setToken(this.token)
            status = true
        }).catch((err) => {
            console.log(err, remember)
        })

        return status
    }

}

export {LoginStore}