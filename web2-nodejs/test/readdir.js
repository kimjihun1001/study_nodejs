var testFolder = './data'; // 'data'와 똑같음. 그럼 현재 폴더의 개념은 뭐지...? 현재 폴더는 test 폴더 아냐?
console.log(testFolder);
var fs = require('fs');

fs.readdir(testFolder, (err, filelist) => {
    console.log(filelist);
})