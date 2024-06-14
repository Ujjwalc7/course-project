import axios from "axios";
import { baseUrl } from "../../../config/baseUrl";


// function to get all tweets from DB
const replyTweet = async(postId, formData, jwt)=>{
    try {
        const resp = await axios.put(baseUrl + `api/post/id/${postId}/reply`, formData, {
            headers:{
                Authorization: "Bearer " + jwt,
                'Content-Type': 'multipart/form-data'
            }
        });
        return resp.data;
    } catch (error) {
        console.log(error);
        throw new Error(error.response.data);
    }
}

export default replyTweet;