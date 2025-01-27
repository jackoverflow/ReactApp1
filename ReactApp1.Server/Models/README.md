# Models Documentation

This document provides an overview of the models used in the application, their purposes, and how they relate to each other.

## 1. Student

### Description
The `Student` model represents a student in the system. It contains basic information about the student, such as their first name, last name, and date of birth.

### Properties
- **Id**: Unique identifier for the student (Primary Key).
- **FirstName**: The first name of the student.
- **LastName**: The last name of the student.
- **DateOfBirth**: The birth date of the student.

### Relationships
- **Many-to-Many with Subject**: A student can be enrolled in multiple subjects, and a subject can have multiple students enrolled. This relationship is managed through the `StudentSubject` junction table.

## 2. Subject

### Description
The `Subject` model represents a subject that students can enroll in. It contains information about the subject, such as its name and description.

### Properties
- **Id**: Unique identifier for the subject (Primary Key).
- **ShortName**: A short name or code for the subject.
- **Description**: A detailed description of the subject.

### Relationships
- **Many-to-Many with Student**: Similar to the `Student` model, a subject can have multiple students enrolled, and a student can enroll in multiple subjects. This relationship is also managed through the `StudentSubject` junction table.

## 3. StudentSubject

### Description
The `StudentSubject` model serves as a junction table to manage the many-to-many relationship between `Student` and `Subject`. It links students to the subjects they are enrolled in.

### Properties
- **StudentId**: Foreign key referencing the `Student` model.
- **SubjectId**: Foreign key referencing the `Subject` model.

### Relationships
- **Many-to-One with Student**: Each record in `StudentSubject` is associated with one student.
- **Many-to-One with Subject**: Each record in `StudentSubject` is associated with one subject.

## 4. StudentWithSubjects

### Description
The `StudentWithSubjects` model is a view model that combines the `Student` model with a list of subjects that the student is enrolled in. This model is used to simplify data retrieval when displaying student information along with their subjects.

### Properties
- **FirstName**: The first name of the student.
- **LastName**: The last name of the student.
- **Subjects**: A list of `Subject` objects representing the subjects the student is enrolled in.

### Navigation Properties
- **List<Subject>**: This property is a navigation property that allows you to access the subjects associated with a student. In Entity Framework, navigation properties are used to define relationships between entities and enable lazy loading of related data.

## Relationships Overview

- **Many-to-Many Relationship**: The relationship between `Student` and `Subject` is a many-to-many relationship, which means:
  - A student can enroll in multiple subjects.
  - A subject can have multiple students enrolled.
  
  This relationship is facilitated by the `StudentSubject` junction table, which contains foreign keys referencing both the `Student` and `Subject` models.

## Conclusion

Understanding these models and their relationships is crucial for managing student enrollments effectively within the application. The use of navigation properties, such as `List<Subject>`, allows for easy access to related data, enhancing the overall functionality and usability of the application.
