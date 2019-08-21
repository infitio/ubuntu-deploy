const {sEx} = require('./utils');


function unzipBuild(file, out_folder){
    sEx(`unzip -o -q ${file} -d ${out_folder}`);
    console.log("unzip complete...");
}

function setupVenv(venv_folder){
    sEx(`python3 -m venv ${venv_folder}`);
    console.log("venv setup complete...");
}

/**
 * @param {Runner} runner
 * */
function installDependencies(runner){
    let build = runner.project.getBuild(runner.runner_config.args.build);
    sEx(`which python`);
    sEx(`python --version`);
    // let sourceIt = `source ${runner.venv_folder}/bin/activate`;
    // let cdToCurrent = `cd ${runner.current_folder}`;
    sEx(`sudo chown -R ${runner.runAs} ${runner.base_folder}`);
    sEx(`pip install -q wheel`);
    sEx(`pip install -q -r ${build.deployPath}/requirements.txt`);
    sEx(`touch ${build.envFile}`);
    console.log("requirements installed...");
    // sEx(`${sourceIt} && ${cdToCurrent} && python manage.py collectstatic --noinput`);
}

/**
 * @param {Runner} runner
 * */
async function deploy(runner){
    for(let build of runner.project.builds){
        unzipBuild(build.buildFilePath, build.deployPath);  //TODO delete folder on unzip success
        if(build.isDjango){
            setupVenv(build.venvFolder);
        }
    }
}

/**
 * @param {Runner} runner
 * */
async function postDeploy(runner){
    installDependencies(runner);
}

module.exports = {
    deploy, postDeploy
};