const jwt=require("jsonwebtoken")
const {BlackListModel}=require("../Models/logout.model")
const auth=async(req,res,next)=>{
  console.log(req.headers)
  const token=req.headers.authorization?.split(" ")[1]

  
    try {
      const blackListed=await BlackListModel.findOne({blackList_token:token})
      if(blackListed){
       return res.send({msg:"you have been logged out, Please login in again"})
       
      }
      
      if (token) {
        jwt.verify(token, process.env.AcessKey, (err, decoded) => {
          if (decoded) {
          //   res
          //     .status(200)
          //     .send({ msg: "You are authorized to see the series..." });
          req.body.userID=decoded.userID
          req.body.username=decoded.username
              next()
          } else {
            res.status(200).send({ error: err.message });
          }
        });
      } else {
        res.status(400).send({ msg: "you are not authorized" });
      }
    } catch (error) {
      res.status(200).send({msg:error.message})
    }
    
}

module.exports={
    auth
}