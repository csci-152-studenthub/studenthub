import { API } from "aws-amplify";


export default {
    getposts(){
        const getposts = API.get("posts", "/posts/get-posts");
        return getposts;
    },
    getresources(useremail){
        const getresources = API.get("posts", "/resources/get-resources", useremail);
        return getresources;
    }
};