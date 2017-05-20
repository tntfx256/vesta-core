const vesta = require('@vesta/devmaid');
const aid = new vesta.TypescriptTarget({
    targets: ['es5', 'es6'],
    genIndex: true,
    files: ['.npmignore', 'LICENSE', 'README.md'],
    transform: {
        package: (json, target) => {
            if (target === 'es5') {
                json.devDependencies.typescript = '2.0';
                json.devDependencies['@types/es6-promise'] = '^0.0.32';
            }
        }
    }
});

aid.createTasks();