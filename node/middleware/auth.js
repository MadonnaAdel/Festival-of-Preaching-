const jwt = require('jsonwebtoken');
const dotnet = require('dotenv');

const auth = (req,res,next) => {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "you must login first" });
    try {
        const verified = jwt.verify(token, process.env.SECRET);
        req.admin = verified;
        next();
    } catch (err) {
        console.log(err);
        res.status(400).json({message:err})
}
}
module.exports={
    auth
} 
