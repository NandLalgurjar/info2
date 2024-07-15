const { default: mongoose } = require("mongoose");
const user = require("../../api/user/model");

exports.allUser = async (req, res) => {
    try {
        let serchobj = {};
        if (req.query?.name && req.query.name != "") {
            serchobj.name = { $regex: req.query.name, $options: "i" };
        }

        if (req.query?.referId && req.query.referId != "") {
            serchobj.referId = new mongoose.Types.ObjectId(req.query.referId)
        }

        if (req.query?.email && req.query.email != "") {
            serchobj.email = { $regex: req.query.email, $options: "i" };
        }

        if (req.query?.mobile && req.query.mobile != "") {
            serchobj.phone = { $regex: req.query.mobile, $options: "i" };
        }

        if (req.query?.gender && req.query.gender != "") {
            serchobj.gender = req.query.gender
        }

        if (req.query?.status && req.query.status != "") {
            serchobj.type = req.query.status;
        }

        const data = await user.aggregate([
            { '$match': serchobj }, {
                '$lookup': {
                    'from': 'orders',
                    'localField': '_id',
                    'foreignField': 'userId',
                    'as': 'result'
                }
            }, {

                '$lookup': {
                    from: "users",
                    localField: "_id",
                    foreignField: "referId",
                    as: "referUser"
                }
            }, {
                '$project': {
                    'name': 1,
                    'phone': 1,
                    'email': 1,
                    'password': 1,
                    'otp': 1,
                    '__v': 1,
                    'updatedAt': 1,
                    'auth': 1,
                    'image': 1,
                    'dateOfBirth': 1,
                    'gender': 1,
                    'type': 1,
                    'userWallet': 1,
                    'numberOfOrder': {
                        '$cond': {
                            'if': {
                                '$isArray': '$result'
                            },
                            'then': {
                                '$size': '$result'
                            },
                            'else': 'NA'
                        }
                    }, 'numberOfreferel': {
                        '$cond': {
                            'if': {
                                '$isArray': "$referUser",
                            },
                            'then': {
                                '$size': "$referUser",
                            },
                            'else': "NA",
                        },
                    },
                }
            }
        ]);

        return data
    } catch (error) {
        console.log(error);
    };
};

exports.AddNewUser = async (req) => {
    try {
        console.log(12345, gfc);
    } catch (error) {
        console.log(error);
        return error;
    }
}


