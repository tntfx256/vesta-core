const execSync = require("child_process").execSync;
const fs = require("fs");
const gulp = require("gulp");
const mkdir = require("mkdirp");
const rimraf = require("rimraf");

class Packager {
    constructor(config) {
        this.config = config;
    }

    createTasks() {
        // creating development tasks
        this.config.targets.forEach(target => {
            gulp.task(`dev[${target}]`, () => {
                this.compile(target, false);
                gulp.watch(`src/**`, () => {
                    this.compile(target, false);
                });
            });
        });
        // creating publish task
        gulp.task("publish", () => {
            this.config.targets.forEach(target => {
                this.publish(target);
            });
        });
    }

    compile(target, isProduction) {
        this.log(`Starting compile[${target}]`);
        const destDirectory = `${this.config.base}/${target}`;
        if (isProduction || !this.firstRun) {
            this.firstRun = true;
            this.prepare(target, isProduction);
        }
        try {
            execSync(`"${this.config.root}/${destDirectory}/node_modules/.bin/tsc"`, {
                cwd: destDirectory,
                stdio: "inherit"
            });
        } catch (e) {
            this.error(`compile error[${target}]`, e.message);
        }
        this.log(`Finished compile[${target}]`);
    }

    publish(target) {
        this.log(`Starting publish[${target}]`);
        const destDirectory = `${this.config.base}/${target}`;
        this.compile(target, true);
        try {
            execSync(`npm publish --access=public`, {cwd: destDirectory, stdio: "inherit"});
            this.log(`Finished publish[${target}]`);
        } catch (e) {
            this.error(`Error publish[${target}]`, e.message);
        }
    }

    prepare(target, isProduction) {
        const destDirectory = `${this.config.base}/${target}`;
        if (isProduction) {
            rimraf.sync(destDirectory);
        }
        mkdir.sync(destDirectory);
        // copying static files
        const files2copy = [".npmignore", "LICENSE", "README.md"];
        files2copy.forEach(file => {
            fs.copyFileSync(file, `${destDirectory}/${file}`);
        });
        // package.json
        let packageJson = JSON.parse(fs.readFileSync("package.json"));
        if (this.config.transform && this.config.transform.package) {
            packageJson = this.config.transform.package(packageJson, target, isProduction);
        }
        fs.writeFileSync(`${destDirectory}/package.json`, JSON.stringify(packageJson, null, 2));
        // tsconfig.json
        let tsConfigJson = JSON.parse(fs.readFileSync("tsconfig.json"));
        if (this.config.transform && this.config.transform.tsconfig) {
            tsConfigJson = this.config.transform.tsconfig(tsConfigJson, target, isProduction);
        }
        fs.writeFileSync(`${destDirectory}/tsconfig.json`, JSON.stringify(tsConfigJson, null, 2));
        // installing packages
        execSync(`npm i`, {
            cwd: destDirectory,
            stdio: "inherit"
        });
    }

    log(message) {
        const d = new Date();
        const time = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        console.log(`[${time}] ${message}`);
    }

    error(message, error) {
        const d = new Date();
        const time = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        console.error(`[${time}] ${message} (${error})`);
    }
}

module.exports = Packager;