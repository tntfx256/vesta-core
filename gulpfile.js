const {
    existsSync
} = require("fs");
// const Packager = require("./resources/Packager");
// const Indexer = require("./resources/Indexer");
const vesta = require("@vesta/devmaid");
// const base = "vesta";

// creating index file
const indexer = new vesta.Indexer(`${__dirname}/src`);
indexer.generate();

function tsCompile(key) {
    let configFile = `tsconfig.${key}.json`;
    isSecondary = existsSync(configFile);
}

// creating packages
const pkgr = new vesta.Packager({
    root: __dirname,
    src: "src",
    targets: ["es6", "es5"],
    files: [".npmignore", "LICENSE", "README.md"],
    transform: {
        package: function (package, target, isProduction) {
            if (target == "es5") {
                package.name = `${package.name}-es5`;
                package.dependencies['es6-promise'] = '^4.1.0';
                package.devDependencies['@types/es6-promise'] = '^0.0.32';
            }
            if (isProduction) {
                delete package.private;
            }
        },
        tsconfig: function (tsconfig, target, isProduction) {
            // tsconfig.compilerOptions.module = "es2015";
            // tsconfig.include = ["../../src/**/*"];
            // tsconfig.exclude = [`../../${base}/**/*`];
        }
    }
});

pkgr.createTasks();