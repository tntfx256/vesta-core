const gulp = require('gulp');
const fse = require('fs-extra');
const execSync = require('child_process').execSync;

const sourceFiles = ['src/**'];
const targets = ['es5', 'es6'];

gulp.task('prepare', () => {
    targets.forEach(target => {
        echo(`\n\tPreparing ${target}...\n`);
        // delete old directories
        fse.removeSync(target);
        // copy common files
        ['.npmignore', 'README.md', 'LICENSE'].forEach(file => {
            fse.copySync(file, `${target}/${file}`);
        });
        // modifying package.json based on target
        let packageJson = JSON.parse(fse.readFileSync('./package.json', {encoding: 'utf8'}));
        let tscJson = JSON.parse(fse.readFileSync('./tsconfig.json', {encoding: 'utf8'}));
        if (target === 'es5') {
            packageJson.name = '@vesta/core-es5';
            packageJson.devDependencies.typescript = '2.0';
            packageJson.devDependencies['@types/es6-promise'] = '^0.0.32';
            tscJson.compilerOptions.target = 'es5';
        }
        delete packageJson.scripts;
        fse.writeFileSync(`./${target}/package.json`, JSON.stringify(packageJson, null, 2));
        fse.writeFileSync(`./${target}/tsconfig.json`, JSON.stringify(tscJson, null, 2));
    });
    // installing packages
    targets.forEach(target => {
        echo(`\n\n\tInstalling packages for ${target}\n`);
        execSync('yarn install', {stdio: 'inherit', cwd: target});
    });
});

let tsc = {es5: true, es6: true};
targets.forEach(target => {
    gulp.task(`copy:${target}`, () => gulp.src(sourceFiles).pipe(gulp.dest(`${target}/src`)));
    gulp.task(`watch:${target}`, () => {
        gulp.watch(sourceFiles, [`copy:${target}`]);
    });
    gulp.task(`dev:${target}`, [`copy:${target}`], () => {
        execSync('tsc -w -p .', {stdio: 'inherit', cwd: target});
    });
});


gulp.task('publish', () => {
    targets.forEach(target => {
        execSync('npm publish --access=public', {stdio: 'inherit', cwd: target});
    });
});

function echo(text) {
    process.stdout.write(text);
}
