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
        subject: "Reestablece tu contraseña",
        text: "Reestablece tu contraseña",
        html: `<p>Hola, ${nombre}, has solicitado reestablecer tu contraseña. </p>
        <p>Para generar una nueva contraseña, da click en el siguiente enlace: 
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Contraseña </a> </p>
        <p>Si tú no solicitaste este cambio, puedes ignorar este mensaje. </p>
        `
      });

      console.log("Mensaje enviado: %s", info.messageId);
};

export default emailRegistro;