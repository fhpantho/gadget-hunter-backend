# Gadget Hunter - Backend API

This is the backend server for the Gadget Hunter application. It provides a RESTful API for managing products and handles database interactions using MongoDB.

## 🚀 Features

- **RESTful API**: Endpoints for CRUD operations on products.
- **Security**: Implemented using `helmet` for header security.
- **Logging**: Request logging with `morgan`.
- **CORS Support**: Configured to work seamlessly with the Next.js frontend.
- **MongoDB Integration**: Efficient data storage and retrieval.

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Hosting**: Vercel

## ⚙️ Installation & Setup

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/fhpantho/gadget-hunter-backend.git
    cd gadget-hunter-backend
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory and add the following:

    ```env
    MONGO_URI=your_mongodb_connection_string
    ```

4.  **Run the server**:

    ```bash
    # For development (requires nodemon)
    npm run dev

    # Standard start
    npm start
    ```

## 📡 API Endpoints

### Health Check

- **GET** `/`
  - Returns a status message indicating the API is running.

### Products

- **GET** `/products`
  - Fetch all products.
  - **Response**: Array of product objects.

- **GET** `/products/:id`
  - Fetch a single product by its MongoDB `_id`.
  - **Response**: Single product object.

- **POST** `/products`
  - Add a new product.
  - **Body**:
    ```json
    {
      "name": "Product Name",
      "description": "Product Description",
      "price": 99.99,
      "image": "https://image.url",
      "category": "Electronics"
    }
    ```

## 🚀 Deployment

The backend is configured for deployment on [Vercel](https://vercel.com).
The `vercel.json` file handles the configuration for serverless function execution.
