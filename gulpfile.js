const { Indexer, Packager } = require("@vesta/devmaid");

// creating index file
const indexer = new Indexer(`${__dirname}/src`);
indexer.generate();

// creating packages
const pkgr = new Packager({
    root: __dirname,
    src: "src",
    targets: ["es6", "es5"],
    files: [".npmignore", "LICENSE", "README.md"],
    transform: {
        package: function(package, target, isProduction) {
            if (isProduction) {
                delete package.private;
            }
            return false;
        },
        tsconfig: function(tsconfig, target, isProduction) {
            tsconfig.target = target;
        }
    }
});

module.exports = pkgr.createTasks();