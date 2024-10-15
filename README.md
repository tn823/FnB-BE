# Creating the README.md file for the Back-End project based on the provided content
readme_be_content = """
# F&B Back-End Project

## 📝 Project Description

This project is the Back-End system for managing the F&B platform. It handles requests from the frontend, interacts with the database, and manages the business logic, authentication, and API functionalities.

---

## 🧑‍💻 Tech Stack

The following technologies are used in this project:

- **Node.js**: Version 20.x
- **Express**: Version 7.0.8
- **MySQL**: Version 8.0.32
- **REST API**: Handles the API architecture for the application

---

## 🚀 Getting Started

To start the project locally, follow the steps below:

1. **Build Docker containers**:

    ```bash
    docker compose build
    ```

2. **Start Docker containers**:

    ```bash
    docker compose up
    ```

3. **Install dependencies**:

    ```bash
    npm install
    ```

4. **Run the development server**:

    ```bash
    npm run dev
    ```

5. **Access the project**:

    Open your browser at: [http://localhost:3000](http://localhost:3000)

6. **Swagger API Documentation**:

    Access the Swagger docs for the API at: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 📁 Dummy Data

Use the following admin credentials for testing purposes:

- **Email**: `admin@example.com`
- **Password**: `password123`
"""

# Writing the content to a README_BE.md file
with open("/mnt/data/README_BE.md", "w") as file:
    file.write(readme_be_content)
