// backend/services/emailService.js
const nodemailer = require('nodemailer');
const path = require('path');

// Función para enviar el correo de bienvenida
exports.sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: process.env.MAIL_PORT == 465,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `Hotel Paraíso <${process.env.MAIL_FROM}>`,
      to: userEmail,
      subject: "¡Bienvenido al Hotel Paraíso! 🏨🌴",
      html: `
        <h1>¡Hola, ${userName}!</h1>
        <p>Gracias por registrarte en el Hotel Paraíso. Estamos encantados de tenerte con nosotros.</p>
        <p>Ya puedes iniciar sesión y explorar nuestras increíbles habitaciones y servicios.</p>
        <br>
        <p>¡Esperamos verte pronto!</p>
        <p>El equipo del Hotel Paraíso</p>
        <br>
        <img src="cid:logo" style="width: 150px;"/> 
      `,
      attachments: [{
        // --- CAMBIO AQUÍ: de .jpg a .png ---
        filename: 'logoparaiso.png',
        path: path.join(__dirname, '../assets/logoparaiso.png'),
        cid: 'logo'
      }]
    });

    console.log(`Correo de bienvenida enviado exitosamente a ${userEmail}.`);

  } catch (error) {
    console.error("Error al enviar el correo de bienvenida:", error);
  }
};