const shell = require('shelljs');
const config = require('./config');


function createBuildsDir(runner){
    runner.builds_folder = config.project_folder+'/bundle';
    runner.current_folder = config.project_folder+'/current';
    runner.run_folder = config.project_folder+'/run';
    runner.venv_folder = config.project_folder+'/run/venv';
    shell.mkdir('-p', runner.builds_folder);
    shell.mkdir('-p', runner.current_folder);
    shell.mkdir('-p', runner.run_folder);
}

module.exports = (runner) => {
    createBuildsDir(runner);
};
