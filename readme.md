## D2 ERD from Oracle

### query
list :
 - tables (type)(triggers?)
 - views ? MVs ? 
 - columns (type, nullable, constraint, fk/pk, index name and type)
 - FKs (table.column->table.column)

### inputs
 - db URL (+creds), required
 - table exclusions(comma separated) - optional, default none
 - out d2 name - optional, default out.d2
 - img name - optional, default out.svg
 - detail : basic (minimal) / all (everything) 


## based on
D2 ERD from Postgres
https://github.com/zekenie/d2-erd-from-postgres/
