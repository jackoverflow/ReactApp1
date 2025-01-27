# Components Documentation

This document provides an overview of the components used in the React application, their purposes, and how they interact with each other.

## 1. AddStudent

### Description
The `AddStudent` component is responsible for adding new students to the system. It provides a form for users to input student details such as first name, last name, and date of birth.

### Key Features
- **Form Input**: Users can enter the student's first name, last name, and date of birth.
- **Validation**: The component validates the input fields to ensure all required information is provided.
- **User Feedback**: It provides feedback to users through toast notifications upon successful addition or error messages if the submission fails.

### Properties
- **firstName**: The first name of the student being added.
- **lastName**: The last name of the student being added.
- **dateOfBirth**: The date of birth of the student being added.

### Methods
- **handleInputChange**: Updates the state for the input fields as the user types.
- **handleSubmit**: Handles the form submission, sending the new student data to the server.

## 2. AddSubject

### Description
The `AddSubject` component is responsible for adding new subjects to the system. It provides a form for users to input subject details such as short name and description.

### Key Features
- **Form Input**: Users can enter the subject's short name and description.
- **Validation**: The component validates the input fields to ensure all required information is provided.
- **User Feedback**: It provides feedback to users through toast notifications upon successful addition or error messages if the submission fails.

### Properties
- **shortName**: The short name of the subject being added.
- **description**: The description of the subject being added.

### Methods
- **handleInputChange**: Updates the state for the input fields as the user types.
- **handleSubmit**: Handles the form submission, sending the new subject data to the server.

## 3. EditStudent

### Description
The `EditStudent` component is responsible for editing the details of an existing student. It provides a form pre-filled with the student's current information, allowing users to make changes and save them.

### Key Features
- **Pre-filled Form**: The component fetches the current details of the student and displays them in a form for editing.
- **Validation**: The component validates the input fields to ensure all required information is provided before submission.
- **User Feedback**: It provides feedback to users through toast notifications upon successful updates or error messages if the submission fails.

### Properties
- **studentId**: The unique identifier of the student being edited.
- **firstName**: The first name of the student being edited.
- **lastName**: The last name of the student being edited.
- **dateOfBirth**: The date of birth of the student being edited.

### Methods
- **handleInputChange**: Updates the state for the input fields as the user types.
- **handleSubmit**: Handles the form submission, sending the updated student data to the server.

## 4. EditSubject

### Description
The `EditSubject` component is responsible for editing the details of an existing subject. It provides a form pre-filled with the subject's current information, allowing users to make changes and save them.

### Key Features
- **Pre-filled Form**: The component fetches the current details of the subject and displays them in a form for editing.
- **Validation**: The component validates the input fields to ensure all required information is provided before submission.
- **User Feedback**: It provides feedback to users through toast notifications upon successful updates or error messages if the submission fails.

### Properties
- **subjectId**: The unique identifier of the subject being edited.
- **shortName**: The short name of the subject being edited.
- **description**: The description of the subject being edited.

### Methods
- **handleInputChange**: Updates the state for the input fields as the user types.
- **handleSubmit**: Handles the form submission, sending the updated subject data to the server.

## 5. EnrolStudent

### Description
The `EnrolStudent` component is responsible for enrolling students in subjects. It allows users to search for students, select subjects, and update the enrollment status.

### Key Features
- **Student Search**: Users can search for students by their first or last name. The component displays a list of matching students.
- **Subject Selection**: Users can select multiple subjects from a dropdown list. The component uses a multi-select HTML element to facilitate this.
- **Enrollment Management**: The component handles both enrolling students in subjects and removing all subjects if none are selected.
- **User Feedback**: It provides feedback to users through toast notifications and modal alerts.

### Properties
- **selectedStudent**: The currently selected student for enrollment.
- **selectedSubjects**: An array of subject IDs representing the subjects the student is enrolled in.
- **searchTerm**: The term used to filter the list of students.

### Methods
- **handleStudentSelect**: Fetches the subjects associated with the selected student and updates the state.
- **handleSubjectChange**: Updates the selected subjects based on user input.
- **handleSubmit**: Handles the form submission, either enrolling the student in selected subjects or removing their enrollment if no subjects are selected.

## Conclusion

Understanding the components and their functionalities is crucial for maintaining and extending the application. Each component is designed to handle specific tasks, ensuring a modular and organized codebase. This documentation serves as a guide for developers to understand how to work with the components effectively.
