const gulp = require('gulp');
const fse = require('fs-extra');
const ts = require('typescript');
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

gulp.task('index', () => {

    createIndex('src');

    function createIndex(path) {
        let content = [];
        getFormDirectory(`${path}/lib`);
        fse.writeFileSync(`${path}/index.ts`, content.join('\n'));

        function getFormDirectory(path) {
            let files = fse.readdirSync(path);
            files.forEach(file => {
                let filePath = `${path}/${file}`;
                let stat = fse.statSync(filePath);
                if (stat.isDirectory()) {
                    getFormDirectory(filePath);
                } else {
                    content.push(getExports(filePath));
                }
            });
        }

        function getExports(file) {
            let exports = [];
            let sourceCode = fse.readFileSync(file, {encoding: 'utf8'}).toString();
            let srcFile = ts.createSourceFile(file, sourceCode, ts.ScriptTarget.ES6, false);
            srcFile.forEachChild(node => {
                switch (node.kind) {
                    case ts.SyntaxKind.InterfaceDeclaration:
                    case ts.SyntaxKind.ClassDeclaration:
                    case ts.SyntaxKind.FunctionDeclaration:
                    case ts.SyntaxKind.VariableDeclaration:
                    case ts.SyntaxKind.EnumDeclaration:
                        let mod = node.modifiers;
                        if (mod && mod[0].kind === ts.SyntaxKind.ExportKeyword) {
                            exports.push(node.name.text);
                        }
                }
            });
            file = file.replace('src', '.').replace(/\.[\w\d]+$/, '');
            return `export {${exports.join(', ')}} from "${file}";`;
        }
    }
});

gulp.task('publish', () => {
    targets.forEach(target => {
        execSync('npm publish --access=public', {stdio: 'inherit', cwd: target});
    });
});

targets.forEach(target => {
    gulp.task(`copy:${target}`, ['index'], () => gulp.src(sourceFiles).pipe(gulp.dest(`${target}/src`)));
    gulp.task(`watch:${target}`, () => {
        gulp.watch(sourceFiles, [`copy:${target}`]);
    });
    gulp.task(`dev:${target}`, [`copy:${target}`], () => {
        execSync('tsc -w -p .', {stdio: 'inherit', cwd: target});
    });
});

function echo(text) {
    process.stdout.write(text);
}
