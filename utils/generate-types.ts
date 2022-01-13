require("dotenv-flow").config();

const path = require("path");
const spawn = require("child_process").spawn;
const readline = require("readline");

async function main() {
  const nswagPath = path.join(
    process.cwd(),
    "/node_modules/nswag/bin/nswag.js"
  );
  const apiUrl = `${process.env.VUE_APP_SWAGGER_URI}v1/swagger.json`;
  const child = spawn("node", [
    nswagPath,
    "swagger2tsclient",
    "/NullValue:Null",
    "/DateTimeType:string",
    "/GenerateClientClasses:false",
    "/TypeStyle:Interface",
    "/runtime:NetCore20",
    `/input:${apiUrl}`,
    "/output:src/models/generated.ts"
  ]);

  child.stdout.on("data", data => {
    process.stdout.write(data);
  });

  child.stderr.on("data", data => {
    process.stderr.write(data);
  });
}

main();
