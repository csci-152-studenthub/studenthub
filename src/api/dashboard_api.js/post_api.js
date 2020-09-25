import { API } from "aws-amplify";


export default {
    async getstudygroups(useremail){
        const getstudygroups = await API.post("posts", '/studygroups/get-studygroups', useremail)
        return getstudygroups;
    },
    async getstatistics(user){
        const getstatistics = await API.post("posts", '/dashboard/get-statistics',user);
        return getstatistics;
    }

};