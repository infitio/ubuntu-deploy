let {ArgumentParser} = require('argparse');

let parser = new ArgumentParser({
    addHelp: true,
    description: 'Pull suite'
});

parser.addArgument([ '-p', '--project_code' ], {
    required: true,
    help: 'project code: one among: gs, hg, is'
});

parser.addArgument([ '-d', '--deployment' ], {
    required: false,
    help: 'deployment: uat, dev. If not provided, will default to empty i.e. production'
});

parser.addArgument([ '-b', '--branch' ], {
    required: false,
    defaultValue: 'master',
    help: 'Branch from which to get latest build'
});

parser.addArgument([ '-t', '--token' ], {
    defaultValue: process.env.PRIVATE_TOKEN,
    help: 'Gitlab private token for authorization'
});

parser.addArgument([ '-s', '--stage' ], {
    defaultValue: 1,
    help: 'build stage: 1,2,3'
});

let args = parser.parseArgs();

module.exports = args;