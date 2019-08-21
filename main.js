const setup = require('./setup');
const build = require('./build');
const {deploy, postDeploy} = require('./deploy');
const configureSites = require('./configure-site');
const args = require('./args');
const Runner = require('./runner');

let breaker = '--------------------------------------------------------------------------------------------';
async function stage1(runner){
    console.log("setup...");
    setup(runner);
    console.log("build...");
    await build(runner);
    console.log("deploy...");
    await deploy(runner);
    let next = runner.project.builds.filter(_=>_.isDjango).map(build => `source ${build.venvFolder}/bin/activate && ${process.argv[0]} ${process.argv[1]} -p ${args.project_code} --build ${build.buildName} ${args.deployment?('-d '+args.deployment):''} -t ${args.token} -s 2 && deactivate`).join('\n');

    console.log(`Stage 1 complete: Now run the following commands: 
${breaker}
${next}
${breaker}
    `);
}

async function stage2(runner){
    console.log("post deploy...");
    await postDeploy(runner);
    console.log(`Stage 2 complete: now run the following command:
${breaker}
sudo ${process.argv[0]} ${process.argv[1]} -p ${args.project_code} ${args.deployment?('-d '+args.deployment):''} -t ${args.token} -s 3
${breaker}
`);

}

async function stage3(runner){
    console.log("configuring sites...");
    await configureSites(runner);
}

async function run(){
    let runner = new Runner({args});
    switch (args.stage) {
        case "1": return await stage1(runner);
        case "2": return await stage2(runner);
        case "3": return await stage3(runner);
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
