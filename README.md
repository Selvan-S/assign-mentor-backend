# Assign Mentor
## About
This is a backend for the Assign Mentor Task. Built using the JavaScript, React, Express.js, MongoDB, Node.js and Tailwind CSS.

- [Live Preview](https://assign-mentor-selvan.netlify.app/student)
- [Frontend repository](https://github.com/Selvan-S/assign-mentor-frontend)

## Run
Step 1:
```
npm install
```
Step 2: Create .env file
```
.env
```
Step 3: Name the key and value in your .env file as
```
PORT=<4 digit no.>
MONGODB_CONNECTION_STRING=<Connection String>
```
Step 4: Add the `.env` in `.gitignore` file <br/> <br/>
Step 5: Use the below API endpoints for `mentors` and Base URL is `http://localhost:<PORT>/api/v1/mentor`:
```
"/all" -  Get all mentors (GET).
"/:id" - Get specific mentor (GET)
"/create" - Create new mentor (POST). eg., {"title": "todo title"}
"/eidt/:id" - Update mentor (PUT).
"/add/students/:id" - Select one mentor and Add multiple Student (PUT).
```
Step 6: Use the below API endpoints for `students` and Base URL is `http://localhost:<PORT>/api/v1/student`:
```
"/all" -  Get all students (GET).
"/:id" - Get specific student (GET)
"/all/mentor/:id" - show all students for a particular mentor (GET)
"/all/withoutMentor" - A student who has a mentor should not be shown in List (GET)
"/previousMentors/:id" - show the previously assigned mentor for a particular student (GET). 
"/create" - Create new student (POST). eg., {"title": "todo title"}
"/eidt/:id" - Update student (PUT).
"/assignMentor/:id" - Select One Student and Assign one Mentor (PUT).
```
Step 8:
```
npm start
```
