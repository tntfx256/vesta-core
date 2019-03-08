const gulp = require("gulp");
const { genIndex, Packager } = require("@vesta/devmaid");
const { execSync } = require("child_process");

let pkgr = new Packager({
    root: __dirname,
    src: "src",
    targets: ["es6"],
    files: [".npmignore", "LICENSE", "README.md"],
    publish: "--access=public",
    transform: {
        package: (json, target) => {
            delete json.private;
            return false;
        },
        tsconfig: function(tsconfig, target, isProduction) {
            // tsconfig.compilerOptions.target = target;
        }
    }
});

function indexer() {
    genIndex("src");
    return Promise.resolve();
}

function watch() {
    gulp.watch(["src/**/*", "!src/**/index.ts"], indexer);
    return Promise.resolve();
}

const tasks = pkgr.createTasks();
module.exports = {
    default: gulp.series(indexer, tasks.default, watch),
    publish: gulp.series(indexer, tasks.deploy, tasks.publish),
    test: test,
}

// test section
let isWatching = false;

function test() {
    if (!isWatching) {
        isWatching = true;
        gulp.watch(["test/**/*.ts", "src/**/*.ts"], test);
    }

    return exec(`npx tsc --project ${__dirname}/tsconfig.test.json`, `${__dirname}/test`)
        .then((error) => {
            // console.error(error);
            exec("npx jest test", `${__dirname}/test`)
        })
        .then((error) => {
            // console.error(error);
        })

    function exec(command, wd) {
        try {
            console.log(`\n\n\t> ${command}\n`);
            execSync(command, { cwd: wd, stdio: "inherit" });
            return Promise.resolve();
        } catch (error) {
            return Promise.resolve(error);
        }
    }
}