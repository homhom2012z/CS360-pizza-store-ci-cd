import axios from "axios"

export const axiosInstance = axios.create({
    baseURL : "https://cs360-stince.herokuapp.com"
})