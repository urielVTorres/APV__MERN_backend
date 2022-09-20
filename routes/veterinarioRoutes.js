import express from "express";
import { 
    registrar, 
    perfil, 
    confirmar, 
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
} from "../controllers/veterinarioController.js";
import checkAuth from "../middleware/autMiddleware.js";

const router = express.Router();

//------------------Rutas públicas, cualquiera puede acceder a ellas-------------------------------------------------
    router.post('/', registrar);
    router.post("/login", autenticar);
    //utilizar dos puntos : sirve para crear un router dinamico
    router.get("/confirmar/:token", confirmar);
    router.post("/olvide-password", olvidePassword);
    // router.get('/olvide-password/:token', comprobarToken);
    // router.post('/olvide-password/:token', nuevoPassword);
    router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword)


//-------------------------------Rutas privadas-------------------------------------------------------------------------
    router.get('/perfil', checkAuth, perfil);
    router.put('/perfil/:id', checkAuth, actualizarPerfil);
    router.put('/actualizar-password', checkAuth, actualizarPassword);

export default router;
