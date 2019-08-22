const fs = require('fs');
let Handlebars = require('handlebars');
const {sEx} = require('./utils');


/**
 * @param {Build} build
 * @param {Runner} runner
 * */
function configureApacheSite(build, runner){
    let site_config = Handlebars.compile(fs.readFileSync(__dirname+'/templates/apache-site.conf.hbs').toString())({build, runner});
    let available_site = `/etc/apache2/sites-available/${build.qualifiedName}.conf`;
    let enabled_site = `/etc/apache2/sites-enabled/${build.qualifiedName}.conf`;
    fs.writeFileSync(available_site, site_config);
    sEx(`ln -fs ${available_site} ${enabled_site}`);
    sEx('service apache2 restart');
}


/**
 * @param {Build} build
 * @param {Runner} runner
 * */
function configureNginxSite(build, runner){
    let site_config = Handlebars.compile(fs.readFileSync(__dirname+'/templates/nginx-site.conf.hbs').toString())({build, runner});
    let available_site = `/etc/nginx/sites-available/${build.qualifiedName}`;
    let enabled_site = `/etc/nginx/sites-enabled/${build.qualifiedName}`;
    fs.writeFileSync(available_site, site_config);
    sEx(`ln -fs ${available_site} ${enabled_site}`);
    sEx('service nginx restart');
}

/**
 * @param {Build} build
 * */
function createCronJobs(build){
    if(build.isDjango){
        if(build.tasks.cron){
            fs.writeFileSync(
                `/etc/cron.d/${build.qualifiedName}/`,
                `${build.tasks.cron.frequency} ${build.pythonExecutable} ${build.deployPath}/manage.py ${build.tasks.cron.management_command} >> ${build.project.logsFolder}/cronjobs.log`
            )
        }
    }
}

module.exports = (runner)=>{
    for(let build of runner.project.builds){
        createCronJobs(build);
        if(build.isDjango) {
            configureApacheSite(build, runner);
        }else{
            // configureNginxSite(build, runner);
        }
    }
};