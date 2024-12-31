CREATE TABLE Students (
    ID SERIAL,
    Firstname VARCHAR(100) CONSTRAINT nn_firstname NOT NULL,
    Lastname VARCHAR(100) CONSTRAINT nn_lastname NOT NULL,
    BirthDate DATE CONSTRAINT nn_birthdate NOT NULL,
    CONSTRAINT pk_students PRIMARY KEY (ID)
);
