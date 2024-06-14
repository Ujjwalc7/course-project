import axios from "axios";
import { baseUrl } from "../../../config/baseUrl";

const getUSerByJwt = async(jwt)=>{
    try {
        const resp = await axios.get(baseUrl + 'api/user', {
            headers: {
                authorization: 'Bearer ' + jwt
            }
        });
        return resp.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export default getUSerByJwt;