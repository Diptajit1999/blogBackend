const mongoose=require("mongoose");

const blogPostSchema=new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
},{versionKey:false})


const PostModel=mongoose.model("post",blogPostSchema);

module.imports={
    PostModel
}