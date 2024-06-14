import axios from "axios";
import { baseUrl } from "../../../config/baseUrl";


// function to like a tweet
const likeUnlikeTweet = async(postId, jwt)=>{
    try {
        const resp = await axios.put(baseUrl + `api/post/likes/id/${postId}`, {}, {
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

export default likeUnlikeTweet;