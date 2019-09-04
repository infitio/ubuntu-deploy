let Project = require('./project');
let {sEx} = require('./utils');
const os = require('os');
const fetch = require('node-fetch');

class Runner{

    constructor(runner_config){
        console.log("runner_config .>>> \n\n", runner_config, "\n\n<<<<<<<\n\n");
        this.runner_config = runner_config;
        this.base_folder = '/opt/grackn/';
        this.static_base_folder = '/media/grackn/static/';
        this.media_base_folder = '/media/grackn/media/';
        let project_config = require(runner_config.args.project_conf);
        this.project = new Project(project_config, this);
        this.vcs = new VCSHandler({
            branch: runner_config.args.branch,
            project_id: project_config.vcs_identifier,
            job_name: runner_config.args.job_name,
            token: runner_config.args.token,
            gitlab_api: runner_config.args.gitlab_api
        });
        this.branch = runner_config.args.branch;
    }

    get runAs(){
        let username = os.userInfo().username;
        if(username==="root") return this.runner_config.args.runas || this.project.project_config.run_as;
        return username;
    }

}

class VCSHandler{

    constructor(vcs_config){
        this.vcs_config = vcs_config;
    }

    get projectId(){ return encodeURIComponent(this.vcs_config.project_id); }
    get branch(){ return this.vcs_config.branch; }
    get jobName(){ return this.vcs_config.job_name; }
    get token(){ return this.vcs_config.token; }
    get gitlabApiBase(){ return this.vcs_config.gitlab_api; }

    getFileURL(file_path){
        return `/projects/${this.projectId}/jobs/artifacts/${this.branch}/raw/${file_path}?job=${this.jobName}`;
    }

    async downloadArtifactFile(artifact_file_path){
        return await (await fetch(this.gitlabApiBase+this.getFileURL(artifact_file_path), {
            headers: { "PRIVATE-TOKEN": this.token }
        })).text();
    }

    downloadArtifactFileTo(artifact_file_path, destination){
        sEx(`curl --location --header "PRIVATE-TOKEN: ${this.token}" "${this.gitlabApiBase+this.getFileURL(artifact_file_path)}" >> ${destination}`);
    }

}

module.exports = Runner;