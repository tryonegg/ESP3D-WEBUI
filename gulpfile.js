var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  gulpif = require('gulp-if'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  cleanCSS = require('gulp-clean-css'),
  removeCode = require('gulp-remove-code'),
  merge = require('merge-stream'),
  del = require('del'),
  zip = require('gulp-zip'),
  gzip = require('gulp-gzip'),
  htmlmin = require('gulp-htmlmin'),
  replace = require('gulp-replace'),
  fs = require('fs'),
  rename = require('gulp-rename'),
  smoosher = require('gulp-smoosher')
  size = require('gulp-filesize'),
  svgmin = require( 'gulp-svgmin' ),
  svgstore = require( 'gulp-svgstore' );

var fl_lang = false
var en_lang = false
var fr_lang = false
var es_lang = false
var de_lang = false
var it_lang = false
var ja_lang = false
var pl_lang = false
var ptbr_lang = false
var ru_lang = false
var uk_lang = false
var zh_cn_lang = false
var hu_lang = false
var tr_lang = false

function clean() {
  return del(['dist'])
}

function clean2() {
  return del(['dist/js', 'dist/css'])
}
function lint() {
  return gulp.src('www/js/**/app.js').pipe(jshint()).pipe(jshint.reporter('default'))
}

function Copytest() {
  return merge(
    gulp
      .src(['www/index.html'])
      .pipe(removeCode({ production: false }))
      .pipe(removeCode({ cleanheader: true }))
      .pipe(gulp.dest('dist')),
    gulp.src(['www/images/**/*.*']).pipe(gulp.dest('dist/images'))
  )
}

function Copy() {
  return merge(
    gulp
      .src(['www/index.html'])
      .pipe(removeCode({ production: true }))
      .pipe(removeCode({ cleanheader: true }))
      .pipe(gulp.dest('dist')),
    gulp.src(['www/images/**/*.*']).pipe(gulp.dest('dist/images'))
  )
}

function concatApptest() {
  return merge(
    gulp
      .src(['www/js/**/*.js'])
      .pipe(concat('app.js'))
      .pipe(removeCode({ production: false }))
      .pipe(removeCode({ cleanheader: true }))
      .pipe(gulp.dest('./dist/js')),

    gulp.src(['www/css/**/*.css']).pipe(concat('style.css')).pipe(gulp.dest('./dist/css/'))
  )
}

function concatApp() {
  return merge(
    gulp
      .src(['www/js/**/*.js'])
      .pipe(concat('app.js'))
      .pipe(removeCode({ production: true }))
      .pipe(removeCode({ cleanheader: true }))
      .pipe(gulp.dest('./dist/js')),

    gulp.src(['www/css/**/*.css']).pipe(concat('style.css')).pipe(gulp.dest('./dist/css/'))
  )
}

var execSync = require('child_process').execSync

function replaceVersion() {
  return gulp
    .src('dist/index.html')
    .pipe(
      replace(/replaceVERSION/g, function (match, p1) {
        var buildNumber = execSync('git rev-parse --short HEAD')
          .toString()
          .replace(/\r?\n|\r/g, '')
        return 'github.com/MitchBradley/ESP3D-WEBUI@' + buildNumber
      })
    )
    .pipe(gulp.dest('dist'))
}

function replaceSVG() {
  return gulp
    .src('dist/index.html')
    .pipe(
      replace(/<!-- replaceSVG -->(.*?)<!-- \/replaceSVG -->/g, function (match, p1) {
        return fs.readFileSync('dist/images/jogdial.svg', 'utf8')
      })
    )
    .pipe(gulp.dest('dist'))
}

function makeMaslowSVGSprite(  ) {
    // sprite all the svgs except for the jogdials
    return gulp.src( [ 
      'www/images/*.svg',
      '!www/images/jogdial.svg',
      '!www/images/jogdial1.svg',
      '!www/images/jogdial2.svg' 
    ] )
    .pipe(
      svgmin(
        {
          plugins: [
            {
              name: 'removeViewBox',
              active: false,
            },
            {
              name: 'cleanupIDs',
              active: false,
            },
            'removeDesc',
            'removeTitle'
          ]					
        },
        function ( file ) {
          var prefix = path.basename( file.relative, path.extname( file.relative ) );
          return {
            plugins: [ {
              cleanupIDs: {
                prefix: prefix + '-',
                minify: true
              }
            } ]
          };
        }
      )
    )
    .pipe( svgstore( {
      inlineSvg: true
    } ) )
    .pipe( rename('maslow.svg') )
    .pipe( gulp.dest( 'dist/images/' ) );
    
}

function inlineMaslowSVGSprite(  ) {
  return gulp
  .src('dist/index.html')
  .pipe(
    replace(/<!-- replaceSVG -->maslow<!-- \/replaceSVG -->/g, function (match, p1) {
      return fs.readFileSync('dist/images/maslow.svg', 'utf8')
    })
  )
  .pipe(gulp.dest('dist')) ;
return cb;
}


function clearlang() {
  // fetch command line arguments
  console.log('Enable Language:')
  const arg = ((argList) => {
    let arg = {},
      a,
      opt,
      thisOpt,
      curOpt
    for (a = 0; a < argList.length; a++) {
      thisOpt = argList[a].trim()
      opt = thisOpt.replace(/^\-+/, '')

      if (opt === thisOpt) {
        // argument value
        if (curOpt) arg[curOpt] = opt
        curOpt = null
      } else {
        // argument name
        curOpt = opt
        arg[curOpt] = true
      }
    }

    return arg
  })(process.argv)
  if (arg.lang == 'fluidnc') {
    fl_lang = true
    en_lang = false
    fr_lang = false
    es_lang = false
    de_lang = false
    it_lang = false
    ja_lang = false
    hu_lang = false
    pl_lang = false
    ptbr_lang = false
    ru_lang = false
    tr_lang = false
    uk_lang = false
    zh_cn_lang = false
  }
  if (arg.lang == 'grbl') {
    fl_lang = false
    en_lang = true
    fr_lang = true
    es_lang = true
    de_lang = true
    it_lang = true
    ja_lang = false
    hu_lang = false
    pl_lang = true
    ptbr_lang = true
    ru_lang = true
    tr_lang = false
    uk_lang = true
    zh_cn_lang = false
  }
  if (typeof arg.lang == 'undefined' || arg.lang == 'all') {
    fl_lang = false
    en_lang = true
    fr_lang = true
    es_lang = true
    de_lang = true
    it_lang = true
    ja_lang = true
    hu_lang = true
    pl_lang = true
    ptbr_lang = true
    ru_lang = true
    tr_lang = true
    uk_lang = true
    zh_cn_lang = true
  }
  if (arg.lang == 'en') {
    fl_lang = false
    en_lang = true
  }
  if (fl_lang) {
    console.log('fl (fluidnc)')
  }
  if (en_lang) {
    console.log('en')
  }
  if (arg.lang == 'fr') {
    fr_lang = true
  }
  if (fr_lang) {
    console.log('fr')
  }
  if (arg.lang == 'es') {
    es_lang = true
  }
  if (es_lang) {
    console.log('es')
  }
  if (arg.lang == 'de') {
    de_lang = true
  }
  if (de_lang) {
    console.log('de')
  }
  if (arg.lang == 'it') {
    it_lang = true
  }
  if (arg.lang == 'ja') {
    ja_lang = true
  }
  if (hu_lang) {
    console.log('hu')
  }
  if (arg.lang == 'hu') {
    hu_lang = true
  }
  if (it_lang) {
    console.log('it')
  }
  if (ja_lang) {
    console.log('ja')
  }
  if (arg.lang == 'pl') {
    pl_lang = true
  }
  if (pl_lang) {
    console.log('pl')
  }
  if (arg.lang == 'ptbr') {
    ptbr_lang = true
  }
  if (ptbr_lang) {
    console.log('ptbr')
  }
  if (arg.lang == 'ru') {
    ru_lang = true
  }
  if (ru_lang) {
    console.log('ru')
  }
  if (arg.lang == 'tr') {
    tr_lang = true
  }
  if (tr_lang) {
    console.log('tr')
  }
  if (arg.lang == 'uk') {
    uk_lang = true
  }
  if (uk_lang) {
    console.log('uk')
  }
  if (arg.lang == 'zh_CN') {
    zh_cn_lang = true
  }
  if (zh_cn_lang) {
    console.log('zh_CN')
  }
  return gulp
    .src('dist/js/app.js')
    .pipe(removeCode({ fl_lang_disabled: !fl_lang }))
    .pipe(removeCode({ de_lang_disabled: !de_lang }))
    .pipe(removeCode({ en_lang_disabled: !en_lang }))
    .pipe(removeCode({ es_lang_disabled: !es_lang }))
    .pipe(removeCode({ fr_lang_disabled: !fr_lang }))
    .pipe(removeCode({ it_lang_disabled: !it_lang }))
    .pipe(removeCode({ ja_lang_disabled: !ja_lang }))
    .pipe(removeCode({ hu_lang_disabled: !hu_lang }))
    .pipe(removeCode({ pl_lang_disabled: !pl_lang }))
    .pipe(removeCode({ ptbr_lang_disabled: !ptbr_lang }))
    .pipe(removeCode({ ru_lang_disabled: !ru_lang }))
    .pipe(removeCode({ tr_lang_disabled: !tr_lang }))
    .pipe(removeCode({ uk_lang_disabled: !uk_lang }))
    .pipe(removeCode({ zh_cn_lang_disabled: !zh_cn_lang }))
    .pipe(gulp.dest('./dist/js/'))
}

function minifyApp() {
  return merge(
    gulp
      .src(['dist/js/app.js'])
      .pipe(uglify({ mangle: true }))
      .pipe(gulp.dest('./dist/js/')),

    gulp
      .src('dist/css/style.css')
      .pipe(
        cleanCSS({ debug: true }, function (details) {
          console.log(details.name + ': ' + details.stats.originalSize)
          console.log(details.name + ': ' + details.stats.minifiedSize)
        })
      )
      .pipe(gulp.dest('./dist/css/')),

    gulp
      .src('dist/index.html')
      .pipe(htmlmin({ collapseWhitespace: true, minifyCSS: true }))
      .pipe(gulp.dest('dist'))
  )
}

function includehtml() {
  return merge(
    gulp
      .src('dist/index.html')
      .pipe(
        replace(/<file-include w3-include-html="'sub\/(.*?)'"><\/file-include>/g, function (match, p1) {
          return fs.readFileSync('www/sub/' + p1, 'utf8')
        })
      )
      .pipe(gulp.dest('dist/'))
  )
}

function smoosh() {
  return gulp.src('dist/index.html').pipe(smoosher()).pipe(gulp.dest('dist'))
}

function compress() {
  return gulp
    .src('dist/index.html')
    .pipe(gzip({ gzipOptions: { level: 9 } }))
    .pipe(gulp.dest('dist'))
    .pipe(size())
}

gulp.task(clean)
gulp.task(lint)
gulp.task(Copy)
gulp.task(Copytest)
gulp.task(replaceVersion)
gulp.task(replaceSVG)
gulp.task(concatApp)
gulp.task(concatApptest)
gulp.task(minifyApp)
gulp.task(smoosh)
gulp.task(clean2)
gulp.task(clearlang)
gulp.task(makeMaslowSVGSprite)
gulp.task(inlineMaslowSVGSprite)

var defaultSeries = gulp.series(clean, lint, Copy, concatApp, minifyApp, includehtml, includehtml, makeMaslowSVGSprite, inlineMaslowSVGSprite, smoosh)
//var packageSeries = gulp.series(clean,  lint, Copy, concatApp, minifyApp, smoosh, compress);
var packageSeries = gulp.series(
  clean,
  lint,
  Copy,
  concatApp,
  includehtml,
  includehtml,
  makeMaslowSVGSprite, 
  inlineMaslowSVGSprite,
  replaceVersion,
  replaceSVG,
  clearlang,
  minifyApp,
  smoosh,
  compress,
  clean2
)
var package2Series = gulp.series(
  clean,
  lint,
  Copy,
  concatApp,
  includehtml,
  includehtml,
  makeMaslowSVGSprite, 
  inlineMaslowSVGSprite,
  replaceVersion,
  replaceSVG,
  smoosh
)
var package2testSeries = gulp.series(clean, lint, Copytest, concatApptest, includehtml, includehtml, replaceSVG, makeMaslowSVGSprite, inlineMaslowSVGSprite, smoosh)

gulp.task('default', defaultSeries)
gulp.task('package', packageSeries)
gulp.task('package2', package2Series)
gulp.task('package2test', package2testSeries)
