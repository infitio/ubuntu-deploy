const fs = require('fs');


/**
 * @param {Runner} runner
 * */
function clean(runner){
    for(let build of runner.project.builds){
        fs.unlinkSync(build.buildFilePath);
    }
}


module.exports = clean;