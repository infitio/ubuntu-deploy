let Handlebars = require('handlebars');
let fs = require('fs');
const {sEx} = require('./utils');


/**
 * @param {Build} build
 * @param {Runner} runner
 * */
function configureApacheSite(build, runner){
    //TODO update site hbs
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
    //TODO update site hbs
    let site_config = Handlebars.compile(fs.readFileSync(__dirname+'/templates/nginx-site.conf.hbs').toString())({build, runner});
    let available_site = `/etc/nginx/sites-available/${build.qualifiedName}.conf`;
    let enabled_site = `/etc/nginx/sites-enabled/${build.qualifiedName}.conf`;
    fs.writeFileSync(available_site, site_config);
    sEx(`ln -fs ${available_site} ${enabled_site}`);
    sEx('service nginx restart');
}


module.exports = (runner)=>{
    for(let build of runner.project.builds){
        if(build.isDjango) {
            configureApacheSite(build, runner);
        }else{
            configureNginxSite(build, runner);
        }
    }
};
