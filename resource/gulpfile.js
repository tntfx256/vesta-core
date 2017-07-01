const gulp = require('gulp');
const gts = require('gulp-typescript');
const {Transform} = require('stream');
const map = require("gulp-sourcemaps");
const fs = require("fs");


let options = JSON.parse(fs.readFileSync('options.json'));
let tsSourceFiles = options.src;
let tsconfig = options.compilerOptions;
let modules = options.modules;

gulp.task('tsc:' + tsconfig.target, () => {
    let src = gulp.src(tsSourceFiles);
    if (modules) src = src.pipe(module(modules));
    if (tsconfig.sourceMap) src = src.pipe(map.init(src));
    let result = src.pipe(gts(tsconfig));
    result.dts.pipe(gulp.dest('./'));
    return (tsconfig.sourceMap ? result.js.pipe(map.write()) : result.js).pipe(gulp.dest('./'));
});

function module(module) {
    return new Transform({
        objectMode: true,
        transform: function (file, encoding, callback) {
            if (file.contents) {
                file.contents = new Buffer(file.contents.toString().replace(/((import)|(export))(\s*.*from\s*)(["'])([^"']*)(["'])/ig, function (match, $1, $2, $3, $4, $5, $6, $7) {
                    return `${$1}${$4}${$5}${module[$6] ? module[$6] : $6}${$7}`;
                }));
            }
            this.push(file);
            callback();
        }
    });
}