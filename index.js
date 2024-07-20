const oracle = require("oracledb");
const fs = require("fs");
const prompt = require('prompt');

prompt.message = "oracle";
prompt.start();


async function getSchema(dbUrl) {
    prompt.get(
        {
            properties: {
                username: {required: true, hidden: true},
                password: {required: true, hidden: true}
            }
        }, async function (err, input) {
            const connection = await oracle.getConnection({
                user: input.username,
                password: input.password,
                connectString: dbUrl
            });


            const dbResult = await connection.execute(
                 fs.readFileSync("./playground/q1.sql").toString()
            );
            console.log("Result is:", dbResult.rows);
        });

    return;
    const client = new Client(args[0]);
    await client.connect();

    const res = await client.query(query);
    await client.end();

    return res.rows.map((result) => ({
        ...result,
        // postgres sometimes returns [null] for some reason
        foreign_relations: result.foreign_relations.filter(
            (relation) => !!relation
        ),
    }));
}

async function main() {
    const schema = await getSchema(process.argv[2]);
    return;
    const output = eta.render(template, {schema});
    fs.writeFileSync("output.d2", output);
    sh("d2", ["output.d2", "out.svg"]);
}

main();