import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET; 

const authMiddleware = (req, res, next) => {

    const token = req.header('Authorization').replace('Bearer ', '');
    try{
        if (!token) {
            return res.status(401).json({ error: 'Access Denied' }); 
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid Token' }); 
    }
}

export default authMiddleware;