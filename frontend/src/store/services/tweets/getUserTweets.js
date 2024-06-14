import axios from "axios";
import { baseUrl } from "../../../config/baseUrl";


// function to get all tweets from DB
const getUserTweets = async(userId, jwt)=>{
    try {
        const resp = await axios.get(baseUrl + `api/post/get/user/${userId}/all-post`, {
            headers:{
                Authorization: "Bearer " + jwt,
            }
        });
        return resp.data;
    } catch (error) {
        console.log(error);
        throw new Error(error.response.data);
    }
}

export default getUserTweets;