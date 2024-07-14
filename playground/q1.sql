with
  pk_keys as (
    select
        uc.TABLE_NAME,
        ucc.COLUMN_NAME
    from
        USER_CONSTRAINTS uc,
        USER_CONS_COLUMNS ucc
    where uc.CONSTRAINT_NAME = ucc.CONSTRAINT_NAME
      and uc.CONSTRAINT_TYPE ='P'
),
fk_keys as (
    select
        uc.constraint_name fk_name,
        uc.TABLE_NAME fk_table,
        ucc.COLUMN_NAME fk_column,
        ucp.CONSTRAINT_NAME pk_name,
        ucp.TABLE_NAME pk_table,
        uccp.COLUMN_NAME pk_column
    from
        USER_CONSTRAINTS uc,
        USER_CONSTRAINTS ucp,
        USER_CONS_COLUMNS ucc,
        USER_CONS_COLUMNS uccp
    where uc.CONSTRAINT_NAME = ucc.CONSTRAINT_NAME
      and uc.CONSTRAINT_TYPE ='R'
      and uc.r_constraint_name = ucp.CONSTRAINT_NAME
      and uccp.TABLE_NAME = ucp.TABLE_NAME
)  ,
cols as (
select utc.TABLE_NAME, UTC.COLUMN_NAME,UTC.DATA_TYPE || '(' || UTC.DATA_LENGTH || ')', UTC.NULLABLE
    from
        USER_TAB_COLS utc
        )
select * from cols, fk_keys ,pk_keys
         where cols.TABLE_NAME = fk_keys.fk_name(+) and
               cols.TABLE_NAME = pk_keys.TABLE_NAME(+);