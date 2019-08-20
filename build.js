const fetch = require('node-fetch');
const args = require('./args');
const config = require('./config');
const moment = require('moment');
const {passTime, sEx} = require('./utils');


let host_api = "https://gitlab.com/api/v4";
let fetch_options = {headers: { "PRIVATE-TOKEN": args.token }};
async function callAPI(url){
    return await fetch(host_api+url, fetch_options);
}

function downloadFile(url, destination){
    sEx(`curl --location --header "PRIVATE-TOKEN: ${args.token}" "${host_api+url}" >> ${destination}`);
}


async function build(runner){
    let branch = args.branch;
    let version_file = 'bin/version.txt';
    let job_name = 'build_job';
    let version_url = `/projects/${config.project_id}/jobs/artifacts/${branch}/raw/${version_file}?job=${job_name}`;
    let version = await (await callAPI(version_url)).text();
    let app_file = config.getAppFile(version);
    runner.current_build = `${runner.builds_folder}/${config.project_name}-v${version}-${moment().format('YYYY-MM-DD_HH-mm-ss')}.zip`;
    let artifact_url = `/projects/${config.project_id}/jobs/artifacts/${branch}/raw/${app_file}?job=${job_name}`;
    await downloadFile(artifact_url, runner.current_build);
    console.time('tt');
    await passTime(5);
    console.timeEnd('tt');
}

module.exports = build;
