/*jshint esversion: 6 */

const argv = require('yargs').options("playbook", {
  alias: 'p',
  default: 'dev-site.yml',
  describe: 'Antora Playbook file to use to build the site'
}).argv;
import { series, watch } from "gulp";
import { remove } from "fs-extra";
import { readFileSync, readFile, writeFile, writeFileSync, fstat } from "fs";
import { load as yamlLoad } from "yaml-js";
import generator from "@antora/site-generator-default";
import browserSync from "browser-sync";

const server = browserSync.create({ open: false });

//Watch Paths
function watchGlobs() {
  let json_content = readFileSync(`${__dirname}/${argv.p}`, "UTF-8");
  let yaml_content = yamlLoad(json_content);
  let dirs = yaml_content.content.sources.map(source => [
    `${source.url}/**/**.yml`,
    `${source.url}/**/**.adoc`,
    `${source.url}/**/**.hbs`
  ]);
  dirs.push(["dev-site.yml"]);
  dirs = [].concat(...dirs);
  //console.log(dirs);
  return dirs;
}

const siteWatch = () => watch(watchGlobs(), series(build, reload));

const removeSite = done => remove("gh-pages", done);
const removeCache = done => remove(".cache", done);

function build(done) {
  console.log(`Using ${argv.p} to build the site`)
  const args = ["--playbook", argv.p, "redirect_facility", "static"]
  generator(args, process.env)
    .then((ps) => {
      workshopSite(ps)
      done();
    })
    .catch(err => {
      console.log(err);
      done();
    });
}

function workshopSite(ps) {
  //console.log(JSON.stringify(ps));
  const indexFile = `${ps[0].resolvedPath}/index.html`;
  //console.log("Index file:", indexFile);
  readFile(indexFile, "utf8", (err, data) => {
    if (err) {
      console.log(err);
    }
    let fileC = data;
    fileC = fileC.replace(/^(<script>location=)(.*)(<\/script>)/gm, "\$1\$2 + window.location.search \$3");
    writeFileSync(indexFile, fileC);
  });
}

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    open: false,
    host: "0.0.0.0",
    server: {
      baseDir: "./gh-pages"
    }
  });
  done();
}

const _build = build;
export { _build as build };
const _clean = series(removeSite, removeCache);
export { _clean as clean };
const _default = series(_clean, build, serve, siteWatch);
export { _default as default };
//build workshop docs
const _wsite = series(_clean, build);
export { _wsite as site };