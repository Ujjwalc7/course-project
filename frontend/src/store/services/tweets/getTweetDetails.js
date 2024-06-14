import axios from "axios";
import { baseUrl } from "../../../config/baseUrl";


// function to get all tweets from DB
const getTweetDetails = async(id, jwt)=>{
    try {
        const resp = await axios.get(baseUrl + 'api/post/id/getDetails/' + id, {
            headers:{
                Authorization: "Bearer " + jwt,
            }
        });
        return resp.data;
    } catch (error) {
        throw new Error(error.response.data);
    }
}

export default getTweetDetails;