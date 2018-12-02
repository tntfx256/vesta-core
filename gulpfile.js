const { Indexer, Packager } = require("@vesta/devmaid");
const { watch } = require("gulp");
const {execSync} = require("child_process");

// creating index file
const indexer = new Indexer(`${__dirname}/src`);
indexer.generate();

// creating packages
const pkgr = new Packager({
    root: __dirname,
    src: "src",
    targets: ["es6"],
    files: [".npmignore", "LICENSE", "README.md"],
    transform: {
        package: function(package, target, isProduction) {
            if (isProduction) {
                delete package.private;
            }
            return false;
        }
    }
});

module.exports = {
    ...pkgr.createTasks(),
    test: test
}

// test section
let isWatching = false;

function test() {
    if (!isWatching) {
        isWatching = true;
        watch(["test/**/*.ts", "src/**/*.ts"], test);
    }

    return exec(`npx tsc --project ${__dirname}/tsconfig.test.json`, `${__dirname}/test`)
        .then((error) => {
            // console.error(error);
            exec("npx jest test", `${__dirname}/test`)
        })
        .then((error)=>{
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