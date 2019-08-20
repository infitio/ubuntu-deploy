const setup = require('./setup');
const build = require('./build');
const {deploy, postDeploy} = require('./deploy');
const configureSite = require('./config-apache');
const os = require('os');
const config = require('./config');
const args = require('./args');

let breaker = '--------------------------------------------------------------------------------------------';
async function stage1(runner){
    console.log("setup...");
    setup(runner);
    console.log("build...");
    await build(runner);
    console.log("deploy...");
    await deploy(runner);
    console.log(`Stage 1 complete: Now run the following commands: 
${breaker}
source ${runner.venv_folder}/bin/activate && ${process.argv[0]} ${process.argv[1]} -p ${args.project_code} ${args.deployment?('-d '+args.deployment):''} -t ${args.token} -s 2
${breaker}
    `);
    // pip install -r ${runner.current_folder}/requirements.txt
    //sudo node main -p ${args.project_code} ${args.deployment?('-d '+args.deployment):''} -t ${args.token} -s 2
}

async function stage2(runner){
    console.log("post deploy...");
    await postDeploy(runner);
    console.log(`Stage 2 complete: now run the following comamnd:
${breaker}
sudo ${process.argv[0]} ${process.argv[1]} -p ${args.project_code} ${args.deployment?('-d '+args.deployment):''} -t ${args.token} -s 3
${breaker}
`);

}

async function stage3(runner){
    console.log("configuring site for apache...");
    await configureSite(runner);
}

async function run(){
    let runner = {
        project_config: config.project_config,
        deployment_config: config.deployment_config,
        project_id: config.project_id,
        project_name: config.project_name,
        qualified_project_name: config.qualified_project_name,
        builds_folder: config.project_folder+'/bundle',
        current_folder: config.project_folder+'/current',
        current_env_file: config.project_folder+'/current/.env',
        run_folder: config.project_folder+'/run',
        venv_folder: config.project_folder+'/run/venv',
        logs_folder: config.project_folder+'/logs',
        wsgi_path: config.project_folder+'/current/'+config.project_config.wsgi_relative_path,
        run_as: "support"   //or os.userInfo().username
    };
    // let isRoot = os.userInfo().uid===0;
    switch (args.stage) {
        case "1": return /*isRoot && */await stage1(runner);
        case "2": return /*isRoot && */await stage2(runner);
        case "3": return /*isRoot && */await stage3(runner);
        default: await stage1(runner);
    }
}

process.on('beforeExit', async ()=> {
    try{
        // process.chdir(__dirname);
        await run();
    }catch (e) {
        console.error("ERR, exiting:", e);
    }
    process.exit(0);
});
