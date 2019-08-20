const args = require('./args');


let project_id = encodeURIComponent({
    'hg': 'outsource-coromandel/hello-gromor',
    'gs': 'outsource-coromandel/gromor-store',
    'is': 'outsource-coromandel/ideaspace',
    'ws': 'outsource-coromandel/web-service',
}[args.project_code]);

let project_name = {
    'hg': 'hello-gromor',
    'gs': 'gromor-store',
    'is': 'ideaspace',
    'ws': 'web-service',
}[args.project_code];

function getAppFile(version){
    return {
        'hg': `bin/hellogromor_v${version}.zip`,
        'gs': `bin/shakti_v${version}.zip`,
        // 'is': `bin/hellogromor_v${version}.zip`,
        // 'ws': `bin/webservice_v${version}.zip`,
    }[args.project_code];
}

let base_folder = '/opt/python/';
let qualified_project_name = args.deployment?`${project_name}-${args.deployment}`:project_name;
let project_folder = `${base_folder}${qualified_project_name}`;

module.exports = {
    project_id,
    project_name,
    qualified_project_name,
    getAppFile,
    base_folder,
    project_folder
};
