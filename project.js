const now = require('moment')();
const Handlebars = require('handlebars');

class Deployment{

    constructor(deployment_config, build){
        this.deployment_config = deployment_config;
        this.build = build;
    }

    get ssl(){ return this.deployment_config.ssl || this.build.build_config.ssl; }
    get isSSLEnabled(){ return this.ssl.enabled===true; }
    get sslCert(){ return this.ssl.cert; }
    get sslCertKey(){ return this.ssl.key; }
    get port(){ return this.deployment_config.port || (this.isSSLEnabled?443:80); }
    get nginxModules(){ return this.isSSLEnabled?" ssl":""; }
    get proxyPort(){ return this.deployment_config.proxy_port || 8080; }
    get serverName(){ return this.deployment_config.server_name; }
    get headers(){ return this.deployment_config.headers; }
    get otherDirectives(){ return this.deployment_config.other_directives; }
    get env(){ return Object.assign({}, this.build.env, this.deployment_config.env); }

    get is80Port(){ return this.port === 80; }

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

    get deployment(){
        return new Deployment(this.build_config.deployments[this.project.deploymentName], this);
    }

    get buildFilePath(){
        return `${this.project.buildsFolder}/${this.buildName}-v${this.project.version}-${now.format('YYYY-MM-DD_HH-mm-ss')}.zip`
    }

    get deployPath(){
        if(this.isAdhara) return this.project.runner.static_base_folder+this.project.name+'-'+this.buildName;
        return this.project.currentFolder+'/'+this.buildName;
    }
    get qualifiedName(){ return this.project.qualifiedName+'-'+this.buildName; }
    get tasks(){ return this.build_config.tasks; }
    get env(){ return this.build_config.env; }

    //Django specific settings
    get wsgiPath(){ return this.deployPath+'/'+this.build_config.wsgi_relative_path; }
    get venvFolder(){ return this.project.runFolder+'/'+this.buildName+'/venv'; }
    get pythonExecutable(){ return this.venvFolder+'/bin/python3'; }
    get managementFile(){ return this.deployPath+'/manage.py'; }
    get envFile(){ return this.deployPath+'/.env'; }

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
    get sanitizedName(){ return this.qualifiedName.replace(/-/g, '_'); }
    get baseFolder(){ return this.runner.base_folder+this.qualifiedName; }
    get buildsFolder(){ return this.baseFolder+'/bundle'; }
    get currentFolder(){ return this.baseFolder+'/current'; }
    get runFolder(){ return this.baseFolder+'/run'; }
    get logsFolder(){ return this.baseFolder+'/logs'; }

    set version(_){ this._v = _; }
    get version(){ return this._v; }

}


module.exports = Project;
