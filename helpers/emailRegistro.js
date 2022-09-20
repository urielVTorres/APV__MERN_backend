import nodemailer from "nodemailer";

const emailRegistro = async datos => {
    const transporter = nodemailer.createTransport({
        host: process.env.host,
        port: process.env.port,
        auth: {
          user: process.env.user,
          pass: process.env.pass
        }
      });

      const { email, nombre, token } = datos;

      //Enviar el email

      const info = await transporter.sendMail({
        from: "APV - Administrador de Pacientes de Veterinaria",
        to: email,
        subject: "Comprueba tu cuenta en APV",
        text: "Comprueba tu cuenta en APV",
        html: `<p>Hola, ${nombre}, comprueba tu cuenta en APV. </p>
        <p>Tu cuenta ya está lista, solo debes confirmarla accediendo al siguiente enlace: 
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta </a> </p>
        <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje. </p>
        `
      });

      console.log("Mensaje enviado: %s", info.messageId);
};

export default emailRegistro;