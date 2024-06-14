import axios from "axios";
import { baseUrl } from "../../../config/baseUrl";

const getUserById = async(id, jwt)=>{
    try {
        const resp = await axios.get(baseUrl + 'api/user/id/'+id, {
            headers: {
                authorization: 'Bearer ' + jwt
            }
        });
        // console.log(resp);
        return resp.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export default getUserById;