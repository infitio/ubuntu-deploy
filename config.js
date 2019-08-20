const args = require('./args');
const config = require('./config');
const Handlebars = require('handlebars');


let project_config = config[args.project_code];
let deployment_config = project_config.deployments[args.deployment || "default"];
let project_id = encodeURIComponent(project_config.vcs_identifier);
let project_name = project_config.name;

function getAppFile(version){
    return Handlebars.compile(project_config.app_file)({version});
}

let base_folder = '/opt/python/';
let qualified_project_name = args.deployment?`${project_name}-${args.deployment}`:project_name;
let project_folder = `${base_folder}${qualified_project_name}`;

module.exports = {
    project_config,
    deployment_config,
    project_id,
    project_name,
    qualified_project_name,
    getAppFile,
    base_folder,
    project_folder
};
