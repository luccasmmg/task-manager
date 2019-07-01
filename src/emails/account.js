const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'luccasmmg@gmail.com',
    subject: 'Thanks for joining in',
    text: `Welcome to the app, ${name}. Let me know how you get along with the app`
  });
};

const sendLogoutEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'luccasmmg@gmail.com',
    subject: 'Sorry to hear you go',
    text: `Hello ${name}. we sorry to hear that you deleted your account`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendLogoutEmail
};
