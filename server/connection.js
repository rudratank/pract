import mongoose from "mongoose";

const conn=(databaseurl)=>{

    mongoose.connect(databaseurl)
    .then(()=>console.log("Database Connection Successfull..."))
    .catch(()=>console.log(err.message));
};

export default conn;

