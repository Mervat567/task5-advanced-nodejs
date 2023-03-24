const mongoose=require("mongoose");
const databaseURL="mongodb://localhost:27017/Ecommerce";

const connection=()=>{
    return mongoose.connect(databaseURL ,{useNewUrlParser: true})
    .then(()=>{
     console.log("connected to database successfully")
    }).catch((err)=>{
     console.log("MongoDB error:" + err)
    })
}

module.exports=connection