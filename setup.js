const shell = require('shelljs');
const {sEx} = require('./utils');


/**
 * @param {Runner} runner
 * */
function createBuildsDir(runner){
    shell.mkdir('-p', runner.project.buildsFolder);
    shell.mkdir('-p', runner.project.currentFolder);
    shell.mkdir('-p', runner.project.runFolder);
    shell.mkdir('-p', runner.project.logsFolder);
    shell.mkdir('-p', runner.static_base_folder);
}

/**
 * @param {Runner} runner
 * */
function chownDirs(runner){
    sEx(`sudo chown -R ${runner.runAs} ${runner.base_folder}`);
    sEx(`sudo chown -R ${runner.runAs} ${runner.static_base_folder}`);
    sEx(`sudo chown -R ${runner.runAs} ${runner.media_base_folder}`);
}

module.exports = (runner) => {
    createBuildsDir(runner);
    chownDirs(runner);
};
