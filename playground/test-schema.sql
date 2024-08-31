
-- ALTER PLUGGABLE DATABASE test_pdb OPEN;

CREATE TABLE persons
(
    id        NUMBER,
    full_name VARCHAR2(100),
    parent_one NUMBER,
    parent_two NUMBER,
    CONSTRAINT pk_person primary key (id),
    CONSTRAINT fk_person_parent_one
        FOREIGN KEY (parent_one)
            REFERENCES persons (id),
    CONSTRAINT fk_person_parent_two
            FOREIGN KEY (parent_two)
            REFERENCES persons (id)
);

CREATE TABLE USERS (
    id      number,
    person_id,
    CONSTRAINT pk_usr_person primary key (id),
    CONSTRAINT fk_usr_person
        FOREIGN KEY (person_id)
            REFERENCES persons (id)
);



CREATE TABLE ADDRESSES
(
    id        number,
    person_id number,
    value     varchar2(100),
    CONSTRAINT pk_address primary key (id),
    CONSTRAINT fk_person_address
        FOREIGN KEY (person_id)
            REFERENCES persons (id)
);

 
