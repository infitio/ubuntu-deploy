const setup = require('./setup');
const build = require('./build');
const deploy = require('./deploy');


async function run(){
    let runner = {};
    console.log("setup...");
    setup(runner);
    console.log("build...");
    await build(runner);
    console.log("deploy...");
    await deploy(runner);
    console.log("Build updated");
}

process.on('beforeExit', async ()=> {
    try{
        await run();
    }catch (e) {
        console.error("ERR, exiting:", e);
        process.exit(0);
    }
});
