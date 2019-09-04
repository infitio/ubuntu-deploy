const setup = require('./setup');
const build = require('./build');
const deploy = require('./deploy');
const cleanup = require('./cleanup');
const setupServers = require('./setup-server');
const args = require('./args');
const Runner = require('./runner');

async function run(){
    let runner = new Runner({args});

    console.log(`Setting up instance for ${runner.project.name}:
    environment: ${runner.project.deploymentName}
    builds: 
        ${runner.project.builds.map(build => {
        `Name: ${build.buildName}
Deployment: ${build.deploymentName}
Environment: ${build.deployment.env?JSON.stringify(build.deployment.env, null, 2):'-'}`    
    }).join('\n\t\t---\n')}
    `);

    console.log("setup...");
    setup(runner);

    console.log("build...");
    await build(runner);

    console.log("deploy...");
    await deploy(runner);

    console.log("setting up servers...");
    await setupServers(runner);

    cleanup(runner);
    console.log(`${runner.project.qualifiedName} | Deployment complete...`);

}

process.on('beforeExit', async ()=> {
    try{
        await run();
    }catch (e) {
        console.error("ERR, exiting:", e);
    }
    process.exit(0);
});
