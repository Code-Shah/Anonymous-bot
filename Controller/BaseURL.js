const axios = require("axios")

const Token = ""

const Base_url = `https://api.telegram.org/bot${Token}`;

function GetAxiosInstance() {

    return {
        get(method, params) {
            return axios.get(`/${method}`, {
                baseURL: Base_url,
                params: params
            })
        },
        post(method, data) {
            return axios({
                method: "post",
                baseURL: Base_url,
                url: `/${method}`,
                data
            })
        }
    }
}