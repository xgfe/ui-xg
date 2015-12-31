var glob = require("glob"),
    fs = require('fs');
module.exports = {
    formateDate:function formateDate(){
        var d = new Date(),
            year = d.getFullYear(),
            month = d.getMonth()+1,
            day = d.getDate();
        function addZero(num){
            if(num>9){
                return ''+num;
            }else{
                return '0'+num;
            }
        }
        return year + '-' + addZero(month) + '-' + addZero(day);
    },
    matchFile: function (blobstr,options) {
        return glob.sync(blobstr, options);
    },
    readFile: function (filePath) {
        return fs.readFileSync(filePath).toString();
    }
};