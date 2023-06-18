const nodemailer = require('nodemailer');

exports.sendMail = async (toEmail, subject, body) => {
    try {
        console.log('---------', process.env.EMAIL)
        let mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_KEY
            }
        });

        let mailDetails = {
            from: process.env.EMAIL,
            to: toEmail,
            subject: subject,
            html: body,
        };


        mailTransporter.sendMail(mailDetails, function (err, data) {
            if (err) {
                console.log(err, 'Error Occurs');
            } else {
                console.log('Email sent successfully');
            }
        });
        return;
    } catch (error) {
        throw error;
    }
}


exports.sendResetPasswordMail = async (name, email, token,subject) => {
    try {
     // console.log("emailuser----->",config.emailUser)
      const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com", //smtp used to send mail
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.EMAIL, //email id of sender
          pass: process.env.EMAIL_KEY, //app password(setup done in google account settings)
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL, //email id of sender   (initially it was config.emailUser)
        to: email, //receiver's mailid
        subject: subject,
        html:`<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #2B5238;text-decoration:none;font-weight:600">Bitinfy</a>
          </div>
          <p style="font-size:1.1em">Hi,</p>
          <p>Thank you for choosing Bitinfy. Use the following OTP to complete the procedures.OTP is valid for 1 minute.If you didn't request this, you can ignore this email or let us know.</p>
          <h2 style="background: #2B5238;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${token}</h2>
          <p style="font-size:0.9em;">Regards,<br />Bitinfy</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Bitinfy</p>
            <p>1600 Amphitheatre Parkway</p>
            <p>India</p>
          </div>
        </div>
      </div>`
      };
  
      transporter.sendMail(mailOptions, function (error, info) {
        //sending mail using sendMail method of nodemailer
        if (error) {
          console.log(error);
        } else {
          console.log("mail sent", info.response);
        }
      });
    } catch (e) {
      return { status: 0, msg: e.message };
    }
  };


exports.AddMinutesToDate=(date, minutes)=>{
    return new Date(date.getTime() + minutes * 60000);
  }
