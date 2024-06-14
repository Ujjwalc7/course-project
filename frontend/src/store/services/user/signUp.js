import axios from "axios";
import { baseUrl } from "../../../config/baseUrl";

const signUp = async(body)=>{
    try {
        const resp = await axios.post(baseUrl + 'api/auth/signup', body);
        localStorage.setItem('jwt', resp.data.token);
        return resp.data.user;
    } catch (error) {
        throw new Error(error.message);
    }
}

export default signUp;