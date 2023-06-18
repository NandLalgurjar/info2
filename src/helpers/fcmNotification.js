var admin = require("firebase-admin");

var serviceAccount = require("../../public/nandlal-90686-firebase-adminsdk-64hle-69e3d3bda7.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

exports.sendNotification = ({ body }) => {
    try {
        console.log("sendNotification", 1)
        if (!body.appkey) {
            return {
                success: false,
                message: "please Enter valide appkey!",
            };
        };

        console.log("sendNotification", 2)
        const message = {
            notification: {
                title: body.title,
                body: body.body
            },
            // Replace with the target device's FCM registration token
            token: body.appkey
        };

        admin.messaging().send(message).then((response) => {
            console.log('Notification sent successfully:', response);
            return {
                success: true,
                message: "Notification sent successfully !",
                response
            };
        }).catch((error) => {
            console.error('Error sending notification:', error);
            throw {
                success: false,
                message: "Error sending notification !",
                error: error.message
            };
            /*  return {
                 success: false,
                 message: "Error sending notification !",
                 error
             }; */
        });

    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message
        };
    };
};

exports.sendNotificationForArbitrage = (data) => {
    try {
        if (!data.appkey) {
            return {
                success: false,
                message: "please Enter valide appkey!",
            };
        };
        let body = `your aleart is hit buy From 
        target is ${data.Buy.target}
        coin is ${data.Buy.coin_id}  
        ${data.Buy.exname}
        Buy price is ${data.Buy.last}
        sell on${data.sell.exname}
        sell price is ${data.sell.last} 
        Profit is ${data.profit}`

        const message = {
            notification: {
                title: data.title,
                body: body
            },
            // Replace with the target device's FCM registration token
            token: data.appkey
        };

        admin.messaging().send(message).then((response) => {
            console.log('Notification sent successfully:', response);
            return {
                success: true,
                message: "Notification sent successfully !",
                response
            };
        }).catch((error) => {
            console.error('Error sending notification:', error);
            throw {
                success: false,
                message: "Error sending notification !",
                error: error.message
            };
            // return {
            //     success: false,
            //     message: "Error sending notification !",
            //     error: error.message
            // };
        });

    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message
        };
    };
};