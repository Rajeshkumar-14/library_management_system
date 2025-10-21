# Library Management System Backend Setup

Welcome to Library Management System project, built with React.js and Django Rest Framework.  📚

## Technologies Used

- Django Rest Framework
- JSON Web Token (JWT)
- Email-Based Password Reset
- Poetry (for package management)

## Project Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Rajeshkumar-14/library_management_system.git
   ```
   ⚠️**Note:** Change directory to the `backend` folder before proceeding with setup.
2. **Create and Activate Conda Environment:**

- Create a new Conda environment or use your existing environment:

     ```bash
     conda create --name lms-env python=3.12
     ```

- Activate the Conda environment:

     ```bash
     conda activate lms-env
     ```
3. **Create .env file:**

- Create a `.env` file in the main directory of `backend` folder for mail sending purpose using [mailtrap.io](https://mailtrap.io/).

     ```env
     EMAIL_HOST=sandbox.smtp.mailtrap.io,
     EMAIL_PORT=2525,
     EMAIL_HOST_USER=your_username,
     EMAIL_HOST_PASSWORD=your_password,

     DB_NAME=your_db_name,
     DB_USER=your_db_user,
     DB_PASSWORD=your_db_password,
     DB_HOST=your_db_host,
     DB_PORT=your_db_port
     ```

- Remove spaces between the variable and equals and the value to avoid errors while copying from the website, also refer `.env.example` file.

4. **Install Dependencies:**

- Install Poetry:

     ```bash
     pip install poetry
     ```

- Run this command after installing Poetry:

     ```bash
     poetry install
     ```

5. **Database Setup:**

- Run these commands to migrate models:

     ```bash
     python manage.py makemigrations
     python manage.py migrate
     ```

- If the above commands don't work, try:

     ```bash
     python manage.py makemigrations library_management
     python manage.py makemigrations library
     python manage.py makemigrations members
     python manage.py migrate
     ```
6. **Create Superuser:**

   ```bash
   python manage.py createsuperuser
    ```
7. **Run Server**
  ```bash
    python manage.py runserver
  ```
8. **Accessing the Admin Dashboard:**

- You can access the Django admin dashboard at [localhost:8000/admin/](http://localhost:8000/admin/) to manage your data. Ensure you have registered a user or created a superuser using the command `python manage.py createsuperuser`

## Contributing

- Contributions are welcome! If you have any suggestions, bug reports, or feature requests, feel free to open an issue or submit a pull request.
