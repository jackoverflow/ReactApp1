-- InitialSchema.sql

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.StudentSubject;
DROP TABLE IF EXISTS public.Subjects;
DROP TABLE IF EXISTS public.Students;
DROP TABLE IF EXISTS public.Users;

-- Create Students table
CREATE TABLE public.Students (
    Id SERIAL PRIMARY KEY,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    DateOfBirth DATE NOT NULL
);

-- Create Subjects table
CREATE TABLE public.Subjects (
    Id SERIAL PRIMARY KEY,
    ShortName VARCHAR(100) NOT NULL,
    Description VARCHAR(255)
);

-- Create StudentSubject join table
CREATE TABLE public.StudentSubject (
    StudentId INT NOT NULL,
    SubjectId INT NOT NULL,
    DateEnrolled TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (StudentId, SubjectId),
    FOREIGN KEY (StudentId) REFERENCES public.Students(Id) ON DELETE CASCADE,
    FOREIGN KEY (SubjectId) REFERENCES public.Subjects(Id) ON DELETE CASCADE
);

-- Create Users table
CREATE TABLE IF NOT EXISTS public.Users (
    Id SERIAL PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL
);
