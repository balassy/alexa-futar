const fs = require('fs');
const AWS = require('aws-sdk');
const gulp = require('gulp');
const del = require('del');
const gutil = require('gulp-util');
const install = require('gulp-install');
const runSequence = require('run-sequence');
const ts = require('gulp-typescript');
const zip = require('gulp-zip');

gulp.task('clean', (done) => 
  runSequence(['clean:dist'], ['clean:package'], done)
);

gulp.task('clean:dist', () => 
  del(['./dist'])
);

gulp.task('clean:package', () => 
  del(['./dist.zip'])
);

gulp.task('tsc', () => {
  const tsProject = ts.createProject('tsconfig.json');
  return tsProject.src()
    .pipe(tsProject())
    .js
    .pipe(gulp.dest('./dist'));
}); 

gulp.task('npm', () => 
  gulp.src('./package.json')
    .pipe(gulp.dest('dist/'))
    .pipe(install({ 
      production: true,
      noOptional: true 
    }))
);

gulp.task('zip', () =>
  gulp.src(['dist/**/*.*', '!dist/package.json'])
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./'))
);

gulp.task('upload', (done) => {
  const lambdaConfig = require('./.aws/lambda-config.json');

  AWS.config.loadFromPath('./.aws/credentials-config.json');

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

gulp.task('pack', (done) => 
  runSequence(['clean'], ['tsc', 'npm'], ['zip'], done)
);

gulp.task('pack:incremental', (done) => 
  runSequence(['clean:package'], ['tsc'], ['zip'], done)
);