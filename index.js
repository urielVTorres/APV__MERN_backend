import express  from "express";
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import conectarDB from "./config/db.js";
import pacienteRoutes from "./routes/pacienteRoutes.js"
import cors from "cors";

const app = express();
//Para decirle a express que vamos a enviar datos de tipo JSON
app.use(express.json());
conectarDB();

const dominiosPermitidos = [process.env.FRONTEND_URL]

const corsOptions = {
    origin: function(origin, callback){
        if(dominiosPermitidos.indexOf(origin)!== -1){
            //El origen del request está permitido
            callback(null, true)
        } else {
            callback(new Error("No permitido por CORS"))
        }
    }
}

app.use(cors(corsOptions));
const PORT = process.env.PORT || 4000
app.listen(PORT, ()=>{
    console.log(`Servidor funcionando en el puerto ${PORT}`)
})

app.use("/api/veterinarios", veterinarioRoutes)
app.use("/api/pacientes", pacienteRoutes)