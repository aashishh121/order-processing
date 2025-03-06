# Inventory Management

    A scalable, event-driven Order Processing System using Node.js,
    Express, MongoDB, Redis, and AWS.

    Features:
        User Authentication: Secure authentication using JWT tokens.
        Order Management: Efficient order creation and tracking.
        Email Notifications: AWS SES integration for order confirmation emails.
        Queue System: AWS SQS for asynchronous order processing.
        Caching Mechanism: Redis for faster data retrieval and performance optimization.

# Important Notes:

        1. AWS SQS: The application leverages AWS SQS, utilizing a LocalStack Docker image to replicate AWS SQS services for local development and testing.

        2. AWS SES: The email functionality is set up with AWS SES in sandbox mode, meaning emails can only be sent to verified recipients. To send emails to unverified recipients, a production configuration is required. To request production access, will need to contact the AWS Support team with the necessary details. For testing purposes, you may use the email address "aashishkumargh@gmail.com" for sender and recipients both.

# Setup Instructions

    Clone this repository and navigate to the project directory:

        To interact with AWS services in this application, the following environment variables are required:



        Make sure to configure these environment variables in your development environment before running the application to successfully interact with AWS services.

    Run below command in terminal
        docker-compose up -d
        npm install
        npm run start

        Ensure that Docker Desktop is running in the background.

The application will be available at http://localhost:5000.

# Postman Collection API

    You can find the Postman collection json file named "Inventory Management.postman_collection.json".
    Import this file into Postman to access the API endpoints.

# Tech Stack

        Node.js + Express.js for API development
        MongoDB for database storage
        Redis for caching
        JWT-based authentication
        AWS SQS for async order processing
        AWS SES for order confirmation emails

# Folder structure

      src/
      │── config/
      │── consumer/
      │── controllers/
      │── enums/
      │── middleware/
      │── models/
      │── producer/
      │── routes/
      │── services/
      │── types/
      │── utils/
