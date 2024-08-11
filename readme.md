# [D2](https://github.com/terrastruct/d2) ERD from OracleDB
  see _[D2](https://github.com/terrastruct/d2#related) ERD from Postgres_ [d2-erd-from-postgres](https://github.com/zekenie/d2-erd-from-postgres/)

## options
 - `exclude` - comma separated list of tables to exclude
 - `d2` - d2 [options](https://d2lang.com/tour/man)


    example :

         d2="--layout=dagre -s"

### inputs TODO   
 - out d2 name - `outd2` - optional, default out.d2
 - include nullable attribute - `nullability` - optional, default `true`
 - img name - `imageName` - optional, default out.svg 
### TODOs        
   - oracle 23 oracle 18
   - flat query (table object not json)
  
 
#### Oracle 19c and JSON_ARRAYAGG
 - describe  distinct   relationships (oracle 19.10 json_arrayagg not implemented .. agregation https://asktom.oracle.com/ords/f?p=100:11:0::::P11_QUESTION_ID:9546118900346418681)
