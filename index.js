const oracle = require("oracledb");
const path = require('node:path');
const fs = require("fs");
const prompt = require('prompt');
const {Eta} = require("eta");

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const {execFileSync: sh} = require("child_process");

prompt.message = "oracle";
prompt.start();


async function render(dbUrl, otherOptions) {
    oracle.fetchAsString = [oracle.CLOB];

    prompt.get(
        {
            properties: {
                username: {required: true, hidden: true, default: 'test_usr'},
                password: {required: true, hidden: true, default: 'pwd1'}
            }
        }, async function (err, input) {
            const connection = await oracle.getConnection({
                user: input.username,
                password: input.password,
                connectString: dbUrl
            });

            const template = new Eta({views: path.join(__dirname, "templates")});

            console.log('render:->',template.render("sql.default.eta", otherOptions))

            const dbResult = await connection.execute(
                template.render("sql.default.eta", otherOptions),
                // fs.readFileSync("./templates/sql.default.eta").toString(),
                [], // A bind parameter is needed to disambiguate the following options parameter and avoid ORA-01036
                {
                    outFormat: 4002,     // outFormat can be OBJECT or ARRAY.  The default is ARRAY
                    fetchInfo: {"C": {type: oracle.STRING}}
                    // fetchArraySize: 100                     // internal buffer allocation size for tuning
                }
            );
            const rs = dbResult.rows;
            const output = template.render("d2.default.eta", rs);
            fs.writeFileSync("output.d2", output);
            console.log('dagre..')
            sh("d2", ["--layout=dagre", "output.d2", "out-dagre.svg"]);
            // console.log('tala..')
            // sh("d2", ["--layout=tala", "output.d2", "out-tala.svg"]);
            // return output;
        });

}

async function main() {
    var otherOptions = require('yargs/yargs')(process.argv.slice(2))
        .usage('Usage: $0 <command> [options]')
        .command('node index.js <db-url> [options]', 'render oracle schema as d2 and png')
        .example('node index.js 127.0.0.1:1521/TEST_DB \\ --d2=--layout=dagre --excludes USERS', 'render oracle TEST_DB schema using dagre layout engine and excluding USERS table as d2 and png')
        .option('excludes', {
            alias: 'e',
            describe: 'comma separated list of tables to exclude'
        })
        .coerce('excludes', ex=>{ return ex.split(/\s*,\s*/).map(table=>"\'"+table+"\'")})
        .parse()
    console.log(otherOptions)
    const url = process.argv[2];
    const schema = render(url, otherOptions);
    return;
}

main();