const mongoose=require("mongoose");

const commentSchema=new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'post', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
},{versionKey:false})


const CommentModel=mongoose.model("comment",commentSchema)

module.exports={
    CommentModel
}