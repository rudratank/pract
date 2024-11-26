import jwt from 'jsonwebtoken';

export const verifyToken = (request, response, next) => {
    const token = request.cookies?.jwt;

    if (!token) {
        console.log("No token provided in cookies");
        return response.status(401).send("You're not authorized!");
    }

    jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
        if (err) {
            console.log("Token verification failed:", err.message);
            return response.status(403).send("Token is not valid");
        }

        request.userId = payload.userId;  
       
        next();
    });
};
