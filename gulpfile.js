const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));

const compileSass = () => {
  return src("./assets/scss/**/*.scss").pipe(sass()).pipe(dest("./assets/css"));
};

const devWatch = () => {
  watch("./assets/scss/**/*.scss", compileSass);
};

exports.default = series(compileSass, devWatch);
