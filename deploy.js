const shell = require('shelljs');

function sEx(cmd){
    let r = shell.exec(cmd);
    if(r.code!==0) {
        throw new Error(`${cmd} | FAILED`);
    }
}

function unzipBuild(file, out_folder){
    sEx(`unzip -o ${file} -d ${out_folder}`);
}

function setupVenv(venv_folder){
    sEx(`python3 -m venv ${venv_folder}`);
}

function installDependencies(venv_folder, current_folder){
    // let sourceIt = `source ${venv_folder}/bin/activate`;
    let cdToCurrent = `cd ${current_folder}`;
    sEx(`pip install -r ${current_folder}/requirements.txt`);
    // sEx(`${sourceIt} && ${cdToCurrent} && python manage.py collectstatic --noinput`);
}

async function deploy(runner){
    unzipBuild(runner.current_build, runner.current_folder);
    setupVenv(runner.venv_folder);
}

async function postDeploy(runner){
    installDependencies(runner.venv_folder, runner.current_folder);
}

module.exports = {
    deploy, postDeploy
};