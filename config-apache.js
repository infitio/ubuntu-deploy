let Handlebars = require('handlebars');
let fs = require('fs');


function configureSite(runner){
    let site_config = Handlebars.compile(fs.readFileSync('./site.conf.hbs').toString())({runner});
    fs.writeFileSync(`/etc/apache2/sites-enabled/${runner.qualified_project_name}.conf`, site_config);
}


module.exports = configureSite;