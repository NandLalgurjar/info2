const { Schema, model, default: mongoose } = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const cronTimingsSchema = Schema({
    exchangeTime: {
        type: Object
    },
    exchaneTickerTime: {
        type: Object
       
    },
    coinTime: {
        type: Object
        
    }
}, { timestamps: true, versionKey: false });

module.exports = model('cronTiming', cronTimingsSchema);