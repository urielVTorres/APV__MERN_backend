import Paciente from "../models/Paciente.js";

export const agregarPaciente = async (req, res)=> {
    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id;
    try{
        const pacienteAlmacenado = await paciente.save(); 
        return res.json(pacienteAlmacenado);
    } catch(error){
        return res.status(400).json({msg: "Ocurrio un error"});
    }
    
}

export const obtenerPacientes = async (req, res) =>{
    const paciente = await Paciente.find().where('veterinario').equals(req.veterinario);

    return res.json(paciente);
}

export const obtenerPaciente = async (req, res) =>{
    const paciente = await Paciente.findById(req.params.id);
    if(!paciente) {
        return res.status(404).json({msg: "Paciente no encontrado"});
    }
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
    return res.json({msg: "Acción no valida"});
    }

    return res.json(paciente);
}

export const actualizarPaciente = async (req, res) =>{
    const paciente = await Paciente.findById(req.params.id);
    if(!paciente) {
        return res.status(404).json({msg: "Paciente no encontrado"});
    }
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
    return res.json({msg: "Acción no valida"});
    }
    //Actualizar paciente
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;
    paciente.fecha = req.body.fecha || paciente.fecha;
    try{
        const pacienteActualizado = await paciente.save();
        return res.json(pacienteActualizado)
    }catch(error){
        console.log(error);
    }
    return res.json(paciente);
}

export const eliminarPaciente = async (req, res) =>{
    const paciente = await Paciente.findById(req.params.id);
    if(!paciente) {
        return res.status(404).json({msg: "Paciente no encontrado"});
    }
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString){
    return res.json({msg: "Acción no valida"});
    }

    try {
        await paciente.deleteOne();
        return res.json({msg: "Paciente eliminado"});
    } catch (error) {
        console.log(error);
    }
    
}