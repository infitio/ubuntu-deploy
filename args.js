let {ArgumentParser} = require('argparse');

let parser = new ArgumentParser({
    addHelp: true,
    description: 'Pull suite'
});

parser.addArgument([ '-p', '--project_conf' ], {
    required: true,
    help: 'project config file: project configuration file'
});

parser.addArgument([ '-d', '--deployment' ], {
    required: false,
    defaultValue: 'default',
    help: 'deployment: uat, dev. If not provided, will default to empty i.e. production'
});

parser.addArgument([ '-b', '--branch' ], {
    required: false,
    defaultValue: 'master',
    help: 'Branch from which to get latest build'
});

parser.addArgument([ '-j', '--job_name' ], {
    required: false,
    defaultValue: 'build_job',
    help: 'job from which artifacts are to be fetched'
});

parser.addArgument([ '-g', '--gitlab_api' ], {
    required: false,
    defaultValue: 'https://gitlab.com/api/v4',
    help: 'Gitlab api base url'
});

parser.addArgument([ '-t', '--token' ], {
    required: true,
    defaultValue: process.env.PRIVATE_TOKEN,
    help: 'Gitlab private token for authorization'
});

parser.addArgument(['-r', '--runas'], {
    required: false,
    default: "root",
    help: 'username of the user as whom the WSGI process has to be run',
});

parser.addARgument(['-s', '--orgscope'], {
    required: false,
    defaultValue: 'grackn',
    help: 'Folder scoping for setting up projects'
});

// parser.addArgument([ '-u', '--build' ], {
//     required: false,
//     defaultValue: '',
//     help: 'build name form builds list'
// });

let args = parser.parseArgs();

module.exports = args;