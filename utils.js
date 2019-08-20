const shell = require('shelljs');


function passTime(secs){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve();
        }, secs*1000);
    });
}

function sEx(cmd){
    let r = shell.exec(cmd);
    if(r.code!==0) {
        throw new Error(`${cmd} | FAILED`);
    }
}

module.exports = {
    passTime,
    sEx
};
