const now = require('moment')();
const Handlebars = require('handlebars');

class Deployment{

    constructor(deployment_config, build){
        this.deployment_config = deployment_config;
        this.build = build;
    }

    get port(){ return this.deployment_config.port; }
    get serverName(){ return this.deployment_config.server_name; }

}


class Build{

    constructor(build_config, project){
        this.build_config = build_config;
        this.project = project;
    }

    get buildName(){ return this.build_config.name || this.project.name; }

    get type(){ return this.build_config.type; }
    get isAdhara(){ return this.build_config.type==='adhara'; }
    get isDjango(){ return this.build_config.type==='django'; }

    get appFile(){ return Handlebars.compile(this.build_config.app_file)({version:this.project.version}); }

    get deployment(){ return new Deployment(this.build_config.deployments[this.project.deploymentName]); }

    get buildFilePath(){
        return `${this.project.buildsFolder}/${this.buildName}-v${this.project.version}-${now.format('YYYY-MM-DD_HH-mm-ss')}.zip`
    }

    get deployPath(){
        if(this.isAdhara) return this.project.runner.static_base_folder+this.buildName;
        return this.project.currentFolder+'/'+this.buildName;
    }
    get qualifiedName(){ return this.project.qualifiedName+'-'+this.buildName; }

    //Django specific settings
    get wsgiPath(){ return this.deployPath+'/'+this.build_config.wsgi_relative_path; }
    get venvFolder(){ return this.project.runFolder+'/'+this.buildName+'/venv' }
    get envFile(){ return this.deployPath+'/.env' }

    //Adhara specific settings
    //...

}


class Project{

    constructor(project_config, runner){
        this.project_config = project_config;
        this.runner = runner;
    }

    get builds(){
        return this.project_config.builds.map(_ => new Build(_, this));
    }

    /**
     * @return Build
     * */
    getBuild(build_name){
        for(let build of this.builds){
            if(build.buildName===build_name) return build;
        }
        return null;
    }

    get name(){ return this.project_config.name; }
    get deploymentName(){ return this.runner.runner_config.args.deployment; }
    get qualifiedName(){
        if(this.deploymentName && this.deploymentName!=="default"){
            return this.name+'-'+this.deploymentName;
        }else{
            return this.name;
        }
    }

    get baseFolder(){ return this.runner.base_folder+this.qualifiedName; }
    get buildsFolder(){ return this.baseFolder+'/bundle'; }
    get currentFolder(){ return this.baseFolder+'/current'; }
    get runFolder(){ return this.baseFolder+'/run'; }
    get logsFolder(){ return this.baseFolder+'/logs'; }

    set version(_){ this._v = _; }
    get version(){ return this._v; }

}


module.exports = Project;