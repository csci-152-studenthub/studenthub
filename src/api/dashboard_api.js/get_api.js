import { API } from "aws-amplify";


export default {
    getposts(){
        const getposts = API.get("posts", "/posts/get-posts")
        return getposts;
    }
};