# Async Image Processor

## Overview

Async Image Processor is a robust Node.js application designed to efficiently process image data from CSV files. The system performs the following tasks:

1. Accepts CSV files containing product information and image URLs
2. Validates CSV data format
3. Asynchronously processes images, compressing them to 50% of their original quality
4. Stores processed image data and associated product information in a database
5. Provides status updates via API and optional webhook notifications

## Features

- Asynchronous CSV and image processing using Bull queue
- MongoDB integration for data persistence
- RESTful APIs for file upload and status checking
- Webhook support for real-time notifications
- Scalable architecture for handling large volumes of data

## Tech Stack

- Node.js
- Express.js
- MongoDB (with Mongoose ORM)
- Bull (for queue management)
- Sharp (for image processing)
- CSV-parser (for CSV file handling)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- MongoDB
- Redis (required for Bull queue)
