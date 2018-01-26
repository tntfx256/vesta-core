const execSync = require("child_process").execSync;
const fs = require("fs");
const gulp = require("gulp");
const mkdir = require("mkdirp");
const rimraf = require("rimraf");
// gulp config
const config = {
    base: "vesta",
    production: false,
    targets: ["es5", "es6"]
};
// creating target specific tasks
config.targets.forEach(target => {
    gulp.task(`dev[${target}]`, () => {
        prepare(target, false);
        compile(target, false);
        gulp.watch(`src/**`, () => {
            compile(target, false);
        });
    });
});
// creating publish task
gulp.task(`publish`, () => {
    config.targets.forEach(target => {
        publish(target);
    });
});
// preparing build environment
function prepare(target, isProduction) {
    const destDirectory = `${config.base}/${target}`;
    if (isProduction) {
        rimraf.sync(destDirectory);
        config.production = true;
    }
    mkdir.sync(destDirectory);
    // copying static files
    const files2copy = [".npmignore", "LICENSE", "README.md"];
    files2copy.forEach(file => {
        fs.copyFileSync(file, `${destDirectory}/${file}`);
    });
    // package.json
    const packageJson = JSON.parse(fs.readFileSync("package.json"));
    packageJson.dependencies['es6-promise'] = '^4.1.0';
    packageJson.devDependencies['@types/es6-promise'] = '^0.0.32';
    if (isProduction) {
        delete packageJson.private;
    }
    fs.writeFileSync(`${destDirectory}/package.json`, JSON.stringify(packageJson, null, 2));
    // tsconfig.json
    const tsConfigJson = JSON.parse(fs.readFileSync("tsconfig.json"));
    tsConfigJson.compilerOptions.target = target;
    tsConfigJson.compilerOptions.module = "es2015";
    tsConfigJson.include = ["../../src/**/*"];
    tsConfigJson.exclude = [`../../${config.base}/**/*`];
    fs.writeFileSync(`${destDirectory}/tsconfig.json`, JSON.stringify(tsConfigJson, null, 2));
    // installing packages
    execSync(`npm i`, {
        cwd: destDirectory,
        stdio: "inherit"
    });
}
// 
function compile(target, isProduction) {
    const destDirectory = `${config.base}/${target}`;
    try {
        execSync(`"${__dirname}/node_modules/.bin/tsc"`, {
            cwd: destDirectory,
            stdio: "inherit"
        });
    } catch (e) {
        console.error(`compile error[${target}]`, e);
    }
}
// 
function publish(target) {
    const destDirectory = `${config.base}/${target}`;
    prepare(target, true);
    compile(target, true);
    try {
        execSync(`npm publish --access=public`, {
            cwd: destDirectory,
            stdio: "inherit"
        });
    } catch (e) {
        console.error(`publish error[${target}]`, e.message);
        process.exit(1);
    }
}
