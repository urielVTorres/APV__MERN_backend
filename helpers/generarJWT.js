import jwt from 'jsonwebtoken';
const generarJWT = (id) => {
    //Se crea una palabra supersecreta en las variables de entorno para codificar el json web token
    return jwt.sign({id: id}, process.env.JWT_SECRET, {
        expiresIn: "30d"
    })
};

export default generarJWT;