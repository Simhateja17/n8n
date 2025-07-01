const { src, dest } = require('gulp');
const gulp = require('gulp');

function buildIcons() {
    return src('nodes/**/*.svg')
        .pipe(dest('dist/nodes/'));
}

gulp.task('build:icons', buildIcons);

exports.default = gulp.series('build:icons');
exports['build:icons'] = buildIcons;
