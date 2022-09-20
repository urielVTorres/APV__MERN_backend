import mongoose from "mongoose";
import 'dotenv/config';

const conectarDB = async ()=>{
    try {
        const db = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const url = `${db.connection.host}:${db.connection.port}`;
        
        console.log(`Base de datos conectada exitosamente en el puerto ${url}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default conectarDB;