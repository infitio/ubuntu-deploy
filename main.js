const setup = require('./setup');
const build = require('./build');
const {deploy, postDeploy} = require('./deploy');
const os = require('os');
const config = require('./config');
const args = require('./args');


async function stage1(runner){
    console.log("setup...");
    setup(runner);
    console.log("build...");
    await build(runner);
    console.log("deploy...");
    await deploy(runner);
    console.log(`Stage 1 complete: Now run the following commands: 
    
    source ${runner.venv_folder}/bin/activate && node main -p ${args.project_code} ${args.deployment?('-d '+args.deployment):''} -t ${args.token} -s 2
    `);
    // pip install -r ${runner.current_folder}/requirements.txt
    //sudo node main -p ${args.project_code} ${args.deployment?('-d '+args.deployment):''} -t ${args.token} -s 2
}

async function stage2(runner){
    console.log("post deploy...");
    await postDeploy(runner);
}

async function run(){
    let runner = {
        builds_folder: config.project_folder+'/bundle',
        current_folder: config.project_folder+'/current',
        run_folder: config.project_folder+'/run',
        venv_folder: config.project_folder+'/run/venv'
    };
    // let isRoot = os.userInfo().uid===0;
    switch (args.stage) {
        case "1": return /*isRoot && */await stage1(runner);
        case "2": return /*isRoot && */await stage2(runner);
        default: await stage1(runner);
    }
}

process.on('beforeExit', async ()=> {
    try{
        await run();
    }catch (e) {
        console.error("ERR, exiting:", e);
    }
    process.exit(0);
});
