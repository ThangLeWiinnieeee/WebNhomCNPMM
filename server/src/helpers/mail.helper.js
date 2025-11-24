import nodemailer from 'nodemailer';

const sendMail = (email, title, content) => {
    //Create a transporter object
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        post: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    })

    //Configure the mailoptions object
    const mailoptions = {
        form: process.env.GMAIL_USER,
        to: email,
        subject: title,
        html: content,
    }

    //Send the email
    transporter.sendMail(mailoptions, function(error, info) {
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Email sent: ', info.response)
        }
    })
}

export default sendMail;