import generarID from "../helpers/generarID.js";
import generarJWT from "../helpers/generarJWT.js";
import Veterinario from "../models/Veterinario.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req,res)=>{
    //req.body es en donde se almacena la información que se postea, se puede aplicar destructuring
    
    //Prevenir usuarios duplicados por el email
    const { email, nombre }= req.body;
    const existeUsuario = await Veterinario.findOne({email: email})
    
    if(existeUsuario) {
        
        const error = new Error('Este email ya está registrado a una cuenta');
        return res.status(400).json({msg: error.message});

    }

    try{
        //Guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body) //Crea el objeto de Veterinario
        const veterinarioGuardado = await veterinario.save() //Para guardar en la base de datos 
        //Enviar el email
        emailRegistro({email, nombre, token: veterinarioGuardado.token});
        
        res.json(veterinarioGuardado);
    } catch(error){
        console.log(error)
    }

}
const autenticar = async (req,res)=>{
    //Primero, verificar que el email está registrado
    const {email, password} = req.body
    const usuario = await Veterinario.findOne({email: email})
    if(!usuario){ //Si el usuario no existe
        const error = new Error("El usuario no existe");
        return res.status(403).json({msg: error.message});
    }
    //Comprobar que la cuenta esté confirmada
    if(!usuario.confirmado){
        const error = new Error("Tu cuenta no ha sido confirmada");
        return res.status(403).json({msg: error.message})
    }
    //Revisar el password
    if( !await usuario.comprobarPassword(password)){
        const error = new Error("Contraseña incorrecta");
        return res.status(403).json({msg: error.message})
    } 

    res.json({ 
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        token: generarJWT(usuario.id)
    });
}
const perfil = (req,res)=>{
    //Como en el middleware guardamos en req la información del usuario, podemos extraer la información de ahí en lugar de buscar en la base de datos
    const { veterinario } = req;
    res.json( veterinario );
}

const confirmar = async (req,res, next)=>{
    const {token} = req.params //Para acceder a los parametros de la URL, en especifico al parametro token
    const usuarioConfirmar = await Veterinario.findOne({token});
    if(!usuarioConfirmar){ //Si el token no existe
        const error = new Error("Token no válido")
        return res.status(404).json({msg: error.message})
    }
    //Si el token es válido
    try {
        //cambiar la información en la base de datos
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();
        
        res.json({msg: "Usuario confirmado correctamente"});

    } catch (error) {
        console.log(error)
        res.json({msg: "No se pudo confirmar la cuenta"});
    
    }
    console.log(usuarioConfirmar);

}

const olvidePassword = async (req,res) => {
    const {email} = req.body;

    const existeVeterinario = await Veterinario.findOne({email: email});
    if(!existeVeterinario){
        const error = new Error("El usuario no existe");
        return res.status(400).json({msg: error.message});
    }
    try{
        existeVeterinario.token = generarID();
        await existeVeterinario.save();
        emailOlvidePassword({
            email, nombre:existeVeterinario.nombre, token:existeVeterinario.token
        })
        res.json({msg: "Hemos enviado un email con las instrucciones"});
    }catch(error){
        console.log(error)
    }
}
const comprobarToken = async (req,res) => {
    const { token } = req.params;

    const tokenValido = await Veterinario.findOne({token});

    if(!tokenValido){
        const error = new Error("Token no válido");
        return res.status(400).json({msg: error.message});
    }

    res.json({ msg: "Token válido y el usuario existe"});

}
const nuevoPassword = async (req,res) => {
    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({token});
    if(!veterinario){
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({msg: "Password modificado correctamente"});
    } catch (error) {
        console.log(error)
    }
}

const actualizarPerfil = async (req, res)=>{
    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario){
        const error = new Error("hubo un error");
        return res.status(400).json({msg: error.message});
    }
    const {email} = req.body;
    if(veterinario.email !== req.body.email){
        const existeEmail = await Veterinario.findOne({email});
        if(existeEmail){
            const error = new Error("Ese email ya está en uso");
            return res.status(400).json({msg: error.message});
        }

    }
    try {
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);
        

    } catch (error) {
        console.log(error);
    }
}

const actualizarPassword = async (req, res)=>{
    //Leer los datos
    const { _id } = req.veterinario;
    const {pwd_actual, pwd_nuevo} = req.body;

    //Comprobar que el usuario exista
    const veterinario = await Veterinario.findById(_id);

    if(!veterinario){
        const error = new Error("Hubo un error")
        return res.status(400).json({msg: error.message});
    }
    //Comprobar su password
    if(await veterinario.comprobarPassword(pwd_actual)){
        //Almacenar el nuevo password
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        return res.json({msg: "La contraseña ha sido cambiada correctamente"});
    } else {
        const error= new Error("La contraseña es incorrecta")
        return res.status(400).json({msg: error.message});
    }

}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}