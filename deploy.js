const shell = require('shelljs');
const os = require('os');
const config = require('./config');


function sEx(cmd){
    let r = shell.exec(cmd);
    if(r.code!==0) {
        throw new Error(`${cmd} | FAILED`);
    }
}

function unzipBuild(file, out_folder){
    sEx(`unzip -o -q ${file} -d ${out_folder}`);
    console.log("unzip complete...");
}

function setupVenv(venv_folder){
    sEx(`python3 -m venv ${venv_folder}`);
    console.log("venv setup complete...");
}

function installDependencies(runner){
    sEx(`which python`);
    sEx(`python --version`);
    // let sourceIt = `source ${runner.venv_folder}/bin/activate`;
    // let cdToCurrent = `cd ${runner.current_folder}`;
    sEx(`sudo chown -R ${os.userInfo().username} ${config.base_folder}`);
    sEx(`pip install -q wheel`);
    sEx(`pip install -q -r ${runner.current_folder}/requirements.txt`);
    sEx(`touch ${runner.current_env_file}`);
    console.log("requirements installed...");
    // sEx(`${sourceIt} && ${cdToCurrent} && python manage.py collectstatic --noinput`);
}

async function deploy(runner){
    unzipBuild(runner.current_build, runner.current_folder);
    setupVenv(runner.venv_folder);
}

async function postDeploy(runner){
    installDependencies(runner);
}

module.exports = {
    deploy, postDeploy
};