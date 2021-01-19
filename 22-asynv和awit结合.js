const fs = require('fs');
const util = require('util');
const mineReadFile = util.promisify(fs.readFile);

async function main(){
    try{
        //读取第一个文件的内容
        let data1 = await mineReadFile('./resource/content.txt');
        let data2 = await mineReadFile('./resource/content2.txt');
        let data3 = await mineReadFile('./resource/content3.txt');

        console.log(data1 + '\n' + data2 + '\n' + data3);
    }catch(e){
        console.log(e);
    }
}

main();