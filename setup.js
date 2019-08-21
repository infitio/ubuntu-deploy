const shell = require('shelljs');


/**
 * @param {Runner} runner
 * */
function createBuildsDir(runner){
    shell.mkdir('-p', runner.project.buildsFolder);
    shell.mkdir('-p', runner.project.currentFolder);
    shell.mkdir('-p', runner.project.runFolder);
    shell.mkdir('-p', runner.project.logsFolder);
}

module.exports = (runner) => {
    createBuildsDir(runner);
};
