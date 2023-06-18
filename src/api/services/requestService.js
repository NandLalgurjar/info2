const request = require('../../model/requestModel');
const { sendMail } = require('../../helpers/sendMail');
//const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { generateOtp } = require('../../helpers/generateOtp');
const { sendOTP } = require('../../helpers/sms');

exports.addRequest = async (req) => {
    try {
        req.body.attachments = req.file.filename
        req.body.userId = req.user._id
        let result = await request.create(req.body);
        this.sendMails(req)
        return {
            success: true,
            message: "your request is submited",
            data: result
        };
    } catch (error) {
        console.log(error);
        throw error;
    };
};

exports.sendMails = (req) => {
    try {
        const email = req.user.email
        const subject = "Request Submission Confirm";
        const body = `Dear ${req.user.fullname},This email serves as confirmation that we have received your query and it has been submitted to our HR department. Kindlyawait their response, as they will address your concerns and provide the necessary information. Thank you for your patience, and we appreciateyour understanding.Best regards,Team bitinfy `;
        let sendMailToUser = sendMail(email, subject, body);
        if (sendMailToUser) {
            const email = process.env.AdminEmail
            const subject = "New Query Received";
            const body = `Dear Admin,I hope this email finds you well.I wanted to bring to your attention that we have received a new query that requires your attention. The details of the query are as follows:Query ID: ${req?.result?._id}Sender: ${req.user.fullname}Please review the query at your earliest convenience and provide a suitable response.If you require any additional information or clarification, please let us know, and we will be happy to assist you.Thank you for your prompt attention to this matter.Best regards,Team bitinfy`;
            let result = sendMail(email, subject, body);
            if (result) {
                return true
            }
        }
    } catch (error) {
        console.log(error);
        throw error;
    };
}


/* 
exports.sendMailToAdmins = async (req) => {
    try {
        let email = process.env.AdminEmail
        let subject = "New Query Received";
        let body = `Dear Admin,

I hope this email finds you well.
I wanted to bring to your attention that we have received a new query that requires your attention. The details of the query are as follows:

Query ID: ${req?.result?._id}
Sender: ${req.user.fullname}
Date: ${new Date()}

Please review the query at your earliest convenience and provide a suitable response.
If you require any additional information or clarification, please let us know, and we will be happy to assist you.

Thank you for your prompt attention to this matter.

Best regards,
Team bitinfy`;
        let result = await sendMail(email, subject, body);
        if (result) {
            return true
        }
    } catch (error) {
        console.log(error);
        throw error;
    };
}

exports.sendMailToUsers = async (req) => {
    try {
        let email = req.user.email
        let subject = "Request Submission Confirm";
        let body = `Dear ${req.user.fullname},
This email serves as confirmation that we have received 
your query and it has been submitted to our HR department. Kindly
await their response, as they will address your concerns and provide 
the necessary information. Thank you for your patience, and we appreciate
your understanding.

Best regards,
Team bitinfy `;

        let sendMailToUser = await sendMail(email, subject, body);
        if (sendMailToUser) {
            return sendMailToUser
        }
    } catch (error) {
        console.log(error);
        throw error;
    };
} */
