const {sEx} = require('./utils');
const fs = require('fs');


function unzipBuild(file, out_folder){
    sEx(`unzip -o -q ${file} -d ${out_folder}`);
}

function setupVenv(venv_folder){
    sEx(`python3 -m venv ${venv_folder}`);
    console.log("venv setup complete...");
}

/**
 * @param {Build} build
 * */
function installDependencies(build){
    let pip = `${build.pythonExecutable} -m pip`;
    sEx(`${pip} install -q wheel`);
    sEx(`${pip} install -q -r ${build.deployPath}/requirements.txt`);
    sEx(`touch ${build.envFile}`);
    console.log("requirements installed...");
    sEx(`${build.pythonExecutable} ${build.managementFile} collectstatic --noinput`);
}

/**
 * @param {Runner} runner
 * */
async function deploy(runner){
    for(let build of runner.project.builds){
        unzipBuild(build.buildFilePath, build.deployPath);
        fs.unlinkSync(build.buildFilePath);
        console.log(`${build.project.qualifiedName} | build moved to deployment folder and build dir cleaned`);
        if(build.isDjango){
            setupVenv(build.venvFolder);
            console.log(`${build.project.qualifiedName} | virtual environment created. Installing dependencies...`);
            installDependencies(build);
            console.log(`${build.project.qualifiedName} | Dependencies installed`);
        }
    }
}

/**
 * @param {Runner} runner
 * */
async function postDeploy(runner){
    let build = runner.project.getBuild(runner.runner_config.args.build);
    installDependencies(build);
}

module.exports = {
    deploy, postDeploy
};