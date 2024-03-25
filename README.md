# Notes Application API

This is the backend API for the Notes application. It is built using Node.js, Express, and MongoDB.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The Notes application API provides endpoints for managing user authentication and notes. It allows users to sign up, log in, reset passwords, and perform CRUD operations on notes. The API is built with Node.js and Express for the server-side logic and MongoDB for data storage.

## Features

- User authentication (sign up, login, reset password)
- Create new notes
- Retrieve notes by user ID
- Update existing notes
- Delete notes

## Installation

To run the API locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/TitanEkanayake/Node-Express-MongoDB-Notes.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Node-Express-MongoDB-Notes
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   Create a `.env` file in the root directory and add the following variables:

   ```plaintext
   PORT=5000
   MONGODB_URI=<your MongoDB connection string>
   EMAIL_USER=<your email address>
   EMAIL_PASS=<your email password>
   ```

5. Start the development server:

   ```bash
   npm start
   ```

6. The API will be accessible at `http://localhost:5000`.

## Usage

Once the API is running, you can use the following endpoints:

### Users

- **POST /api/users/signup**: Register a new user.
- **POST /api/users/login**: Log in an existing user.
- **POST /api/users/forgot-password**: Generate a password reset token and email it to the user.
- **POST /api/users/reset-password**: Reset the user's password using the provided token.

### Notes

- **GET /api/notes/:userId**: Retrieve notes by user ID.
- **POST /api/notes**: Create a new note.
- **PATCH /api/notes/:id**: Update an existing note.
- **DELETE /api/notes/:id**: Delete a note by ID.

### Middleware

- **getnote**: A middleware function to retrieve a note by note ID. If the note does not exist, it returns a 404 error.

```javascript
async function getnote(req, res, next) {
  let note;
  try {
    note = await Note.findById(req.params.id);
    if (note == null) {
      return res.status(404).json({ message: "Cannot find the note" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.note = note;
  next();
}
```

## Contributing

Contributions are welcome! If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or fix: `git checkout -b feature-name`.
3. Make your changes and commit them: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

Feel free to customize this documentation further according to your preferences and requirements.
