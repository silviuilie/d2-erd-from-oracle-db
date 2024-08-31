


# [D2](https://github.com/terrastruct/d2) ERD from OracleDB
  see _[D2](https://github.com/terrastruct/d2#related) ERD from Postgres_ [d2-erd-from-postgres](https://github.com/zekenie/d2-erd-from-postgres/)

## arguments
 - `url` db url
## options 
 - `exclude` - comma separated list of tables to exclude
 - `d2` - d2 [options](https://d2lang.com/tour/man); default value `--layout=dagre`.
    example :

         d2="--layout=tala -s"



### examples

   print some help

        node index.js -h

   render ERD for TEST_PDB excluding USERS table including nullability column attributes with some d2 arguments like layout etc
   
        node index.js 127.0.0.42:1521/TEST_PDB --exclude USERS  -n y --d2 '--debug --layout=tala -s'
   
   wil produce something like :

  ![img](./playground/output.svg)

# TODOs     
   - test oracle 23 oracle 18
   - img name - `imageName` - optional, default output.svg 
   - flat query (table object not json) ?
   - render in some other way the NULLABLE / NOT NULL attribute


#### NOTES :
   - tala engine FK rendering points to PK column as oposed to the free layout engines
   - *Oracle 19c and JSON_ARRAYAGG*
       - describe  distinct   relationships (oracle 19.10 json_arrayagg not implemented .. agregation https://asktom.oracle.com/ords/f?p=100:11:0::::P11_QUESTION_ID:9546118900346418681)
