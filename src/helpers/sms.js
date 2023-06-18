const axios = require('axios');

exports.sendOTP= async (apiKey, sender, recipient, otp) => {
    try {
        const response = await axios.post('https://api.msg91.com/api/v5/otp', {
            authkey: apiKey,
            template_id: 'YOUR_TEMPLATE_ID',
            mobile: recipient,
            sender,
            otp
        });

        if (response.data.type === 'success') {
            console.log('OTP sent successfully');
            console.log('OTP message ID:', response.data.message);
        } else {
            console.error('Failed to send OTP:', response.data.message);
        }
    } catch (error) {
        console.error('Error sending OTP:', error);
    }
}
