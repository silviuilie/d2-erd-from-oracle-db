const oracle = require("oracledb");
const path = require('node:path');
const fs = require("fs");
const prompt = require('prompt');
const {Eta} = require("eta");

const {Command, Option} = require('commander');
const program = new Command();

function commaSeparatedTableList(value) {
    return value.split(',').map(item => `'${item}'`).join(',');
}

program
    .name('d2-orcl-erd')
    .description('creates d2 entity relationship diagram from an Oracle DB instance schema')
    .version('0.0.1')
    .argument('<database url>', 'database url in the common format <ip>:<port>/schema, ex : 127.0.0.1:1521/TEST_DB ')
    .option('--exclude <string>', 'comma separated list of tables to exclude from ERD', commaSeparatedTableList)
    .option('--d2 <string>', 'd2 options. see https://d2lang.com/tour/man','--layout=dagre')
    .addOption(new Option('-n --nulls <string>', 'show nullable y/n','n').default('n').choices(['y', 'n']))
;

const {exec: sh} = require("child_process");

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

            const dbResult = await connection.execute(
                template.render("sql.default.eta", otherOptions),
                [], // A bind parameter is needed to disambiguate the following options parameter and avoid ORA-01036
                {
                    outFormat: 4002,     // outFormat can be OBJECT or ARRAY.  The default is ARRAY
                    fetchInfo: {"C": {type: oracle.STRING}}
                }
            );
            const rs = dbResult.rows;
            rs.nulls = otherOptions.nulls;

            const output = template.render("d2.default.eta", rs);
            fs.writeFileSync("output.d2", output);

            var d2Options = otherOptions.d2 ? otherOptions.d2 : "--layout=dagre";

            sh(`d2 ${d2Options} output.d2 output.svg`)
        });

}

async function main() {
    var execution = program.parse()
    console.log("arguments / database url : ", execution.args);
    console.log("options : ", execution.opts());
    const schema = render(execution.args[0], execution.opts());
    console.log(schema)
}

main();