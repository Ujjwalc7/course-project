import axios from "axios";
import { baseUrl } from "../../../config/baseUrl";

const unfollowUser = async(userDetails, jwt)=>{
    try {
        const resp = await axios.put(baseUrl + 'api/user/unfollow/'+userDetails._id, {}, {
            headers: {
                authorization: 'Bearer ' + jwt
            }
        });
        // console.log(resp);
        return resp.data;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

export default unfollowUser;