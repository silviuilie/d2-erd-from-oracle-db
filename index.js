
const oracle= require("oracledb");

async function getSchema() {

    const connection = await oracle.getConnection ({
        user          : "hr",
        password      : mypw,
        connectString : args[0]
    });

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
    const schema = await getSchema();
    const output = eta.render(template, { schema });
    fs.writeFileSync("output.d2", output);
    sh("d2", ["output.d2", "out.svg"]);
}

main();