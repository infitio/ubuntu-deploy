const shell = require('shelljs');


function createBuildsDir(runner){
    shell.mkdir('-p', runner.builds_folder);
    shell.mkdir('-p', runner.current_folder);
    shell.mkdir('-p', runner.run_folder);
}

module.exports = (runner) => {
    createBuildsDir(runner);
};
