CREATE TABLE Students (
    ID SERIAL,
    Firstname VARCHAR(100) CONSTRAINT nn_firstname NOT NULL,
    Lastname VARCHAR(100) CONSTRAINT nn_lastname NOT NULL,
    BirthDate DATE CONSTRAINT nn_birthdate NOT NULL,
    CONSTRAINT pk_students PRIMARY KEY (ID)
);

CREATE TABLE Subjects (
    ID SERIAL,
    Name VARCHAR(100) CONSTRAINT nn_name NOT NULL,
    Description VARCHAR(255),
    StudentID INT CONSTRAINT fk_student_id REFERENCES Students(ID),
    CONSTRAINT pk_subjects PRIMARY KEY (ID)
);
