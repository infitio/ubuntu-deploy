function passTime(secs){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve();
        }, secs*1000);
    });
}

module.exports = {
    passTime
};
