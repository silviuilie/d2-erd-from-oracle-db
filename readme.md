
# TODOs    
   - drop yargs use commander
   - oracle 23 oracle 18
   - flat query (table object not json)
   






# [D2](https://github.com/terrastruct/d2) ERD from OracleDB
  see _[D2](https://github.com/terrastruct/d2#related) ERD from Postgres_ [d2-erd-from-postgres](https://github.com/zekenie/d2-erd-from-postgres/)

## arguments
 - `url` db url
## options 
 - `exclude` - comma separated list of tables to exclude
 - `d2` - d2 [options](https://d2lang.com/tour/man)
    example :

         d2="--layout=dagre -s"

### inputs TODO    
 - include nullable attribute - `nullability` - optional, default `true`
 - img name - `imageName` - optional, default out.svg 
  
 
#### Oracle 19c and JSON_ARRAYAGG
 - describe  distinct   relationships (oracle 19.10 json_arrayagg not implemented .. agregation https://asktom.oracle.com/ords/f?p=100:11:0::::P11_QUESTION_ID:9546118900346418681)
