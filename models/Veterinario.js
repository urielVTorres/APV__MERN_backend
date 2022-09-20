import mongoose from "mongoose";
//instalar la dependencia bcrypt para hashear los passwords
import bcrypt from "bcrypt";
import generarID from "../helpers/generarID.js";
const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password:{ 
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: () => generarID()
    },
    confirmado: {
        type: Boolean,
        default: false
    }

});

veterinarioSchema.pre('save', async function(){
    //Se ejecuta antes de guardar algo nuevo en la base de datos
    if(!this.isModified("password")){
        return; //Para prevenir que se ejecute lo que resta de la funcion
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
}) //En la documentación se encuentra como Middleware
//Para comprobar el password
veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.password)
}
const Veterinario = mongoose.model('Veterinario', veterinarioSchema);
export default Veterinario;

