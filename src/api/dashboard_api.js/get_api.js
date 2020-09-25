import { API } from "aws-amplify";


export default {
    async getposts(){
        const getposts = await API.get("posts", "/posts/get-posts");
        return getposts;
    },
    async getresources(useremail){
        const getresources = await API.get("posts", "/resources/get-resources", useremail);
        return getresources;
    }
};