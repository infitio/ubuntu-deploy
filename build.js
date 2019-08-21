/**
 * @param {Runner} runner
 * */
async function build(runner){
    runner.project.version = await runner.vcs.downloadArtifactFile('bin/version.txt');
    for(let build of runner.project.builds){
        runner.vcs.downloadArtifactFileTo(
            build.appFile,
            build.buildFilePath
        );
    }
}

module.exports = build;
