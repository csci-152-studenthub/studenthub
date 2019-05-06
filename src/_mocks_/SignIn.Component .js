//mock function

const fakeData ={ code: "NotAuthorizedException", 
                name: "NotAuthorizedException", 
                message: "Incorrect username or password." }


export default aysnc(term) =>{
   return await new Promise((resolve) =>{
        resolve(fakeData)
    })
}