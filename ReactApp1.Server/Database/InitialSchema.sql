-- InitialSchema.sql

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.Subjects;
DROP TABLE IF EXISTS public.Students;

-- Create Students table
CREATE TABLE public.Students (
    ID SERIAL PRIMARY KEY,
    Firstname VARCHAR(100) CONSTRAINT nn_firstname NOT NULL,
    Lastname VARCHAR(100) CONSTRAINT nn_lastname NOT NULL,
    BirthDate DATE CONSTRAINT nn_birthdate NOT NULL
);

-- Create Subjects table
CREATE TABLE public.Subjects (
    ID SERIAL PRIMARY KEY,
    Name VARCHAR(100) CONSTRAINT nn_name NOT NULL,
    Description VARCHAR(255),
    StudentID INT NULL,
    CONSTRAINT fk_student_id FOREIGN KEY (StudentID) REFERENCES public.Students(ID) ON DELETE SET NULL
);
