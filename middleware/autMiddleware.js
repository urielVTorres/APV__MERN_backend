import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";
//Checar si la sesion está iniciada, un middleware se utiliza para hacer comprobaciones antes de mostrar un contenido

const checkAuth = async (req, res, next)=>{
    // console.log(req.headers.authorization); 
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try{
            //Para quitar el Bearer de la autenticación, usamos el método split y separar en el espacio
            const token = req.headers.authorization.split(' ')[1];
            //Para decodificar el token
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            req.veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado");
            
            return next();
    
        }catch(error){
            if(!token){
                const e = new Error("Token no valido");
                return res.status(403).json({ msg: e.message});
            }
        }
    }
};

export default checkAuth;