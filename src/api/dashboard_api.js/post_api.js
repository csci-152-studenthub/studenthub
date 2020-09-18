import { API } from "aws-amplify";


export default {
    getstudygroups(useremail){
        const getstudygroups = API.post("posts", '/studygroups/get-studygroups', useremail)
        return getstudygroups;
    },
    getstatistics(user){
        const getstatistics = API.post("posts", '/dashboard/get-statistics',user);
        return getstatistics;
    }

};