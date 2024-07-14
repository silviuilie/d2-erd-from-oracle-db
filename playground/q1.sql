WITH pk_keys AS (SELECT uc.TABLE_NAME,
                        ucc.COLUMN_NAME
                 FROM USER_CONSTRAINTS uc,
                      USER_CONS_COLUMNS ucc
                 WHERE uc.CONSTRAINT_NAME = ucc.CONSTRAINT_NAME
                   AND uc.CONSTRAINT_TYPE = 'P'
                 GROUP BY uc.TABLE_NAME,
                          ucc.COLUMN_NAME),
     fk_keys AS (SELECT uc.constraint_name  fk_name,
                        uc.TABLE_NAME       fk_table,
                        ucc.COLUMN_NAME     fk_column,
                        ucp.CONSTRAINT_NAME pk_name,
                        ucp.TABLE_NAME      pk_table,
                        uccp.COLUMN_NAME    pk_column,
                        JSON_OBJECT(
                                KEY 'fk_name' VALUE uc.CONSTRAINT_NAME,
                                KEY 'fk_table' VALUE uc.TABLE_NAME,
                                KEY 'fk_column' VALUE ucc.COLUMN_NAME,
                                KEY 'pk_name' VALUE ucp.CONSTRAINT_NAME,
                                KEY 'pk_table' VALUE ucp.TABLE_NAME,
                                KEY 'pk_column' VALUE uccp.COLUMN_NAME
                                WITH UNIQUE KEYS
                        )                   json_fks
                 FROM USER_CONSTRAINTS uc,
                      USER_CONSTRAINTS ucp,
                      USER_CONS_COLUMNS ucc,
                      USER_CONS_COLUMNS uccp
                 WHERE uc.CONSTRAINT_NAME = ucc.CONSTRAINT_NAME
                   AND uc.CONSTRAINT_TYPE = 'R'
                   AND uc.r_constraint_name = ucp.CONSTRAINT_NAME
                   AND uccp.TABLE_NAME = ucp.TABLE_NAME
                 GROUP BY uc.constraint_name,
                          uc.TABLE_NAME,
                          ucc.COLUMN_NAME,
                          ucp.CONSTRAINT_NAME,
                          ucp.TABLE_NAME,
                          uccp.COLUMN_NAME),
     cols AS (SELECT utc.TABLE_NAME,
                     UTC.COLUMN_NAME,
                     UTC.DATA_TYPE || '(' || UTC.DATA_LENGTH || ')' DATA_TYPE,
                     UTC.NULLABLE,
                     JSON_OBJECT(
                             KEY 'table_name' VALUE utc.TABLE_NAME,
                             KEY 'column_name' VALUE UTC.COLUMN_NAME,
                             KEY 'data_type' VALUE UTC.DATA_TYPE || '(' || UTC.DATA_LENGTH || ')',
                             KEY 'NULLABLE' VALUE UTC.NULLABLE
                     )                                              json_cols
              FROM USER_TAB_COLS utc
              GROUP BY utc.TABLE_NAME,
                       UTC.COLUMN_NAME,
                       UTC.DATA_TYPE || '(' || UTC.DATA_LENGTH || ')',
                       UTC.NULLABLE)
SELECT cols.TABLE_NAME,
       pk_keys.COLUMN_NAME                            primary_key,
       json_arrayagg(cols.json_cols RETURNING CLOB)   columns,
       json_arrayagg(fk_keys.json_fks RETURNING CLOB) foreign_relations
FROM cols,
     fk_keys,
     pk_keys
WHERE cols.TABLE_NAME = fk_keys.fk_table(+)
  AND cols.TABLE_NAME = pk_keys.TABLE_NAME
  AND fk_keys.pk_column(+) = pk_keys.COLUMN_NAME
GROUP BY cols.TABLE_NAME,
         pk_keys.COLUMN_NAME
