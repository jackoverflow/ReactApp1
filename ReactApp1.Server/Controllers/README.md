# StudentController Documentation

This document provides an overview of the methods implemented in the `StudentController` class, which handles HTTP requests related to student operations in the application.

## Overview

The `StudentController` is responsible for managing student-related actions, including retrieving student information, enrolling students in subjects, and managing their subject enrollments. The controller uses ASP.NET Core's MVC framework to handle incoming HTTP requests and return appropriate responses.

## Methods

### 1. GetStudents

**HTTP Method**: `GET`  
**Endpoint**: `/api/student`  
**Description**: Retrieves a list of all students in the system along with their enrolled subjects.

**Returns**: 
- A list of `StudentWithSubjects` objects, each containing the student's details and a list of subjects they are enrolled in.

### 2. GetStudentById

**HTTP Method**: `GET`  
**Endpoint**: `/api/student/{id}`  
**Description**: Retrieves detailed information about a specific student identified by their ID.

**Parameters**:
- `id`: The unique identifier of the student.

**Returns**: 
- A `Student` object containing the student's details.

### 3. CreateStudent

**HTTP Method**: `POST`  
**Endpoint**: `/api/student`  
**Description**: Creates a new student record in the system.

**Request Body**: 
- A `Student` object containing the student's first name, last name, and date of birth.

**Returns**: 
- The created `Student` object with its unique ID.

### 4. UpdateStudent

**HTTP Method**: `PUT`  
**Endpoint**: `/api/student/{id}`  
**Description**: Updates the details of an existing student identified by their ID.

**Parameters**:
- `id`: The unique identifier of the student.

**Request Body**: 
- A `Student` object containing the updated details.

**Returns**: 
- The updated `Student` object.

### 5. DeleteStudent

**HTTP Method**: `DELETE`  
**Endpoint**: `/api/student/{id}`  
**Description**: Deletes a student record from the system identified by their ID.

**Parameters**:
- `id`: The unique identifier of the student.

**Returns**: 
- A `204 No Content` response on successful deletion.

### 6. EnrollStudentSubjects

**HTTP Method**: `PUT`  
**Endpoint**: `/api/student/{id}/subjects`  
**Description**: Enrolls a student in one or more subjects.

**Parameters**:
- `id`: The unique identifier of the student.

**Request Body**: 
- An array of subject IDs that the student should be enrolled in.

**Returns**: 
- A `204 No Content` response on successful enrollment.

### 7. UnEnrollStudent

**HTTP Method**: `DELETE`  
**Endpoint**: `/api/student/{studentId}/un-enroll`  
**Description**: Removes all subjects associated with a student when no subjects are selected.

**Parameters**:
- `studentId`: The unique identifier of the student.

**Returns**: 
- A `204 No Content` response on successful deletion of subjects.

## Conclusion

The `StudentController` provides a comprehensive set of methods for managing student records and their subject enrollments. Each method is designed to handle specific operations, ensuring that the application can effectively manage student data and relationships with subjects.
