const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeMail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'thegreatharsh1@gmail.com',
        subject: 'Welcome Mail',
        text: `Welcome dear ${name}, Happy to serve you with my app`
    });
}


const sendCancelMail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'thegreatharsh1@gmail.com',
        subject: 'Exit mail',
        text: `Sorry to see you go dear ${name}, Hope to see you soon`
    });
}

module.exports = {
    sendWelcomeMail,
    sendCancelMail
}