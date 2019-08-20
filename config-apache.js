let Handlebars = require('handlebars');
let fs = require('fs');
const {sEx} = require('./utils');


function configureSite(runner){
    let site_config = Handlebars.compile(fs.readFileSync(__dirname+'/site.conf.hbs').toString())({runner});
    fs.writeFileSync(`/etc/apache2/sites-enabled/${runner.qualified_project_name}.conf`, site_config);
    sEx('service apache2 restart');
}


module.exports = configureSite;
