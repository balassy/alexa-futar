const fs = require('fs');
const AWS = require('aws-sdk');
const gulp = require('gulp');
const del = require('del');
const gutil = require('gulp-util');
const install = require('gulp-install');
const mocha = require('gulp-mocha');
const run = require('gulp-run');
const runSequence = require('run-sequence');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');
const zip = require('gulp-zip');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('clean', (done) =>
  runSequence(['clean:dist'], ['clean:package'], done)
);

gulp.task('clean:dist', () =>
  del(['./dist'])
);

gulp.task('clean:package', () =>
  del(['./dist.zip'])
);

gulp.task('copy-config', () =>
  gulp.src(['./config/skill.json'])
    .pipe(gulp.dest('dist/config'))
);

gulp.task('copy-test-data', () =>
  gulp.src(['./test/test-data/*.*'])
    .pipe(gulp.dest('dist/test/test-data'))
);

gulp.task('tslint', () =>
  tsProject.src()
    .pipe(tslint({
      formatter:  'verbose'
    }))
    .pipe(tslint.report({ summarizeFailureOutput: true }))
);

gulp.task('tsc', () =>
  tsProject.src()
    .pipe(tsProject())
    .js
    .pipe(gulp.dest('./dist'))
);

gulp.task('npm', () =>
  gulp.src('./package.json')
    .pipe(gulp.dest('dist/'))
    .pipe(install({
      production: true,
      noOptional: true
    }))
);

gulp.task('zip', () =>
  gulp.src(['dist/**/*.*', '!dist/package.json', '!dist/test/**/*.*'])
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./'))
);

gulp.task('deploy', (done) => {
  const lambdaConfig = require('./config/lambda.json');

  AWS.config.loadFromPath('./config/aws-credentials.json');

  const lambda = new AWS.Lambda();
  const updateParams = {
    FunctionName: lambdaConfig.functionName,
    ZipFile: fs.readFileSync('dist.zip')
  };

  lambda.updateFunctionCode(updateParams, (err, functionConfiguration) => {
    if (err) {
      gutil.log('Updating the function code failed: ', err);
    }
    done();
  });
});

gulp.task('build', (done) =>
  runSequence(['clean'], ['tslint', 'tsc', 'npm', 'copy-config'], ['test', 'zip'], done)
);

gulp.task('build:incremental', (done) =>
  runSequence(['clean:package'], ['tslint', 'tsc', 'copy-config'], ['test', 'zip'], done)
);

gulp.task('update', (done) =>
  runSequence(['build:incremental'], ['deploy'], done)
);

gulp.task('test:run', () =>
  gulp.src('dist/test/*.spec.js', { read: false })
    .pipe(mocha({ 
      reporter: 'spec', 
      timeout: 5000 
    }))
);

gulp.task('test', (done) =>
  runSequence(['tsc', 'copy-test-data'], ['test:run'], done)
);