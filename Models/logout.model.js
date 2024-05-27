const mongoose=require("mongoose")

const blackListSchema= new mongoose.Schema({
    blackList_token:String
},{
    versionKey:false
})

const BlackListModel=mongoose.model("blacklist",blackListSchema)

module.exports={
    BlackListModel
}