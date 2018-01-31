const Packager = require("./resources/Packager");
const Indexer = require("./resources/Indexer");
const base = "vesta";

// creating index file
const indexer = new Indexer(`${__dirname}/src`);
indexer.generate();

// creating packages
const pkgr = new Packager({
    base: base,
    root: __dirname,
    targets: ["es5", "es6"],
    transform: {
        package: function(package, target, isProduction) {
            if (target == "es5") {
                package.name = `${package.name}-es5`;
                package.dependencies['es6-promise'] = '^4.1.0';
                package.devDependencies['@types/es6-promise'] = '^0.0.32';
            }
            if (isProduction) {
                delete package.private;
            }
            return package;
        },
        tsconfig: function(tsconfig, target, isProduction) {
            tsconfig.compilerOptions.target = target;
            // tsconfig.compilerOptions.module = "es2015";
            tsconfig.include = ["../../src/**/*"];
            tsconfig.exclude = [`../../${base}/**/*`];
            return tsconfig;
        }
    }
});

pkgr.createTasks();