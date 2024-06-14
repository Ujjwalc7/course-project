import axios from "axios";
import { baseUrl } from "../../../config/baseUrl";

const updateUserProfile = async(formData, userId, jwt)=>{
    try {
        const resp = await axios.put(baseUrl + 'api/user/update/id/'+userId, formData, {
            headers:{
                Authorization: 'Bearer ' + jwt,
                "Content-Type": "multipart/form-data"
            }
        });
        return resp.data;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

export default updateUserProfile;