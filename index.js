const oracle = require("oracledb");
const path = require('node:path');
const fs = require("fs");
const prompt = require('prompt');
const {Eta} = require("eta");
const {execFileSync: sh} = require("child_process");

prompt.message = "oracle";
prompt.start();


async function render(dbUrl) {
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


            const dbResult = await connection.execute(
                fs.readFileSync("./playground/default.sql").toString(),
                [], // A bind parameter is needed to disambiguate the following options parameter and avoid ORA-01036
                {
                    outFormat: 4002,     // outFormat can be OBJECT or ARRAY.  The default is ARRAY
                    fetchInfo: {"C": {type: oracle.STRING}}
                    // fetchArraySize: 100                     // internal buffer allocation size for tuning
                }
            );
            const rs = dbResult.rows;
            const template = new Eta({views: path.join(__dirname, "templates")});
            const output = template.render("default.eta", rs);
            fs.writeFileSync("output.d2", output);
            sh("d2", ["--layout=elk", "output.d2", "out.svg"]);
            return output;
        });

}

async function main() {
    const schema = render(process.argv[2]);
}

main();