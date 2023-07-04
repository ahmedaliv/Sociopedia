import jwt from "jsonwebtoken";



export const verifyToken = (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token) {
            return res.status(401).json({ error: "Unauthorized, ACCESS DENIED" });
        }
        if(token.startsWith("Bearer ")){
            token = token.split(" ")[1];
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user= verified;
        next();
    } catch (error) {
        console.error(error.message);
        return res.status(401).json({ error: "Unauthorized, ACCESS DENIED" });
        
    }
}