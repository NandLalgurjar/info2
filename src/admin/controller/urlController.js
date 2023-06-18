const fs = require('fs')
const { parse } = require("csv-parse");
const { urlService: { urlUpdate } } = require("../services")


exports.urlUpdate = async (req, res) => {
    try {
        console.log(req.file, "--")
        let dataArr = [];
        let arr = [];
        let data;
        fs.createReadStream(`./public/uploads/csv/${req.file.filename}`)
            .pipe(parse({ delimiter: ",", from_line: 1 }))
            .on("data", function (row) {
                dataArr.push(row);
            }).on("error", function (error) {
                console.log(error.message);
            }).on("end", async function () {
                console.log("finished");
                for (const item of dataArr) {//jfh
                    let obj = {};
                    obj.base = item[0];
                    obj.target = item[1];
                    obj.name = item[2];
                    obj.url = item[3];
                    arr.push(obj);
                };
                data = await urlUpdate(arr);
                if (data) {
                    res.send(data);
                };
            });
    } catch (error) {
        console.log(error);
        return error;
    };
};