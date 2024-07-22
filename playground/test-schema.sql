
CREATE TABLE person
(
    id        NUMBER,
    full_name VARCHAR2(100),
    parent_one NUMBER,
    parent_two NUMBER,
    CONSTRAINT pk_person primary key (id),
    CONSTRAINT fk_person_parent_one
        FOREIGN KEY (parent_one)
            REFERENCES person (id),
    CONSTRAINT fk_person_parent_two
            FOREIGN KEY (parent_two)
            REFERENCES person (id)
);



CREATE TABLE address
(
    id        number,
    person_id number,
    value     varchar2(100),
    CONSTRAINT pk_address primary key (id),
    CONSTRAINT fk_person_address
        FOREIGN KEY (person_id)
            REFERENCES person (id)
);


SELECT * FROM TAB;