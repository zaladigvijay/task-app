const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API);

sgMail.send({
    to: 'zaladig1@gmail.com',
    from:"zaladig98@gmail.com",
    subject: "Test mail from nodejs",
    text:" This is first mail from node,js",
}).catch((e)=>{console.log(e);})
