import axios from "axios";
import { baseUrl } from "../../../config/baseUrl";


// function to get all tweets from DB
const postTweet = async({formData, jwt})=>{

    try {
        const resp = await axios.post(baseUrl + 'api/post/create/', formData, {
            headers:{
                Authorization: "Bearer " + jwt,
                'Content-Type': 'multipart/form-data'
            }
        });
        return resp.data;
    } catch (error) {
        console.log(error);
        throw new Error(error.response.data.error);
    }
}

export default postTweet;