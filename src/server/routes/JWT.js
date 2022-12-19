const { sign, verify } = require("jsonwebtoken");
const jwtSecretObj = require('../config/configs')

const jwtSecret = jwtSecretObj.toString(); 

//create the user token and set it to user browser
const createJWT = (id, role) => {
    const accessToken = sign(
        {id, admin: role},
        jwtSecret.toString(),
        {expiresIn: '1200s'},

    )
    console.log(accessToken)
    return accessToken;
};

//middleware to verify the user token
const autheticateJWT = (req, res, next) => {
    const accessToken = req.query.cookies['access-token'];
    //check if user logged in by checking access token 
    if (!accessToken)
        return res.status(401).json({Error: "User Not Authenticated!"});
    
    //validate token if it exists. 
    try {
        const validToken = verify(accessToken, jwtSecret);
        if (validToken) {
            req.authenticated = true; 
            return next(); 
        }
    }catch(err) {
        return res.status(400).json({'Error': "JWT not valid"});
    }
}

//middleware to verify admin
const isAdmin = (req, res, next) => {
    auth(req, res, ()=>{
        if (req.body.isAdmin){
            next() 
        }else{
            res.status(403).send("Access Denied! Not authorized.")
        }
    })
}

module.exports = {createJWT, autheticateJWT, isAdmin}; 