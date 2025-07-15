import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const verifyToken = (req,res, next)=> {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({ msg: "No token provide."})
        }
        const token = authHeader.split(" ")[1];

        let JWT_SECRET = process.env.JWT_SECRET;

        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;
        
        next();

    } catch (error) {
        console.log("JWT ERROR:",error);
        return res.status(401).json({ msg: "Invalid or expired token"});
    }
}

export default verifyToken;