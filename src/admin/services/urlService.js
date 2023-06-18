const exchangeTickerModel = require("../../model/exchangeTickerModel");

exports.urlUpdate = async (data) => {
    try {
        let arr = [];
        for (const doc of data) {
            const data = await exchangeTickerModel.updateOne({ 'name': doc.name, 'tickers.base': doc.base, 'tickers.target': doc.target }, { $set: { 'tickers.$.newtrade_url': doc.url } });
            if (data.modifiedCount == 1) {
                arr.push(data);
            };
        };
        return {
            massges: `${arr.length} Url Update Is Succesfully`,
            data: arr

        };
    } catch (error) {
        console.log(error);
    };
};