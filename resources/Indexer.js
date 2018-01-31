const ts = require("typescript");
const fse = require("fs");

class Indexer {

    constructor(dir) {
        this.dir = dir;
    }

    generate() {
        const contents = this.getAllExports(this.dir);
        let codes = [];
        contents.forEach(({exports, file}) => {
            file = file.replace(this.dir, '.').replace(/\.[\w\d]+$/, '');
            codes.push(`export {${exports.join(', ')}} from "${file}";`);
        });
        fse.writeFileSync(`${this.dir}/index.ts`, codes.join('\n'));
    }

    getAllExports(path) {
        let files = fse.readdirSync(path);
        let contents = [];
        files.forEach(file => {
            if (file == 'index.ts') return;
            let filePath = `${path}/${file}`;
            let stat = fse.statSync(filePath);
            if (stat.isDirectory()) {
                contents = contents.concat(this.getAllExports(filePath));
            } else {
                contents.push(this.getExports(filePath));
            }
        });
        return contents;
    }

    getExports(file) {
        let exports = [];
        let sourceCode = fse.readFileSync(file, {
            encoding: 'utf8'
        }).toString();
        let srcFile = ts.createSourceFile(file, sourceCode, ts.ScriptTarget.ES2015, false);
        srcFile.forEachChild((node) => {
            let modifierKind = node.modifiers && node.modifiers[0].kind;
            if (modifierKind && modifierKind === ts.SyntaxKind.ExportKeyword) {
                switch (node.kind) {
                    case ts.SyntaxKind.InterfaceDeclaration:
                    case ts.SyntaxKind.ClassDeclaration:
                    case ts.SyntaxKind.FunctionDeclaration:
                    case ts.SyntaxKind.VariableDeclaration:
                    case ts.SyntaxKind.EnumDeclaration:
                        exports.push((node).name['text']);
                        break;
                    case ts.SyntaxKind.VariableStatement:
                        exports.push((node).declarationList.declarations[0].name['text']);
                }
            }
        });
        return {
            exports,
            file
        };
    }
}

module.exports = Indexer;