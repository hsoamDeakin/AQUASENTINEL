# AQUASENTINEL

Aquasentinel is a loT-based web application designed to provide users with water quality information and visualisation. It enables users to monitor and analyze water quality in real-time. The system collects data from various water quality parameters and provides insights into the overall water health.

## To run AQUASENTINEL:

**A .env file is required to connect to the database and enable the app to run.**

### .env
```
DB_URI="your mongodb database url"
dataCount=1000
FILE_PATH= your_dataset.csv
COLUMN_NAMES=ph,Organic_carbon,Turbidity,Solids,Trihalomethanes
```

### In console, run:
```
npm start
```

**Navigate the app in a web browser. A new user registration will be required.**

## Features

__Main App Features__

* *Interactive Dashboards*: Real-time and historical data visualisations for water quality monitoring.
* *Data Filtering*: Customizable views based on time and location filters.
* *User Authentication*: Secure login system to user-specific interaction with the platform.
* *Alerts System*: Automated notifications for critical water quality changes.
  
__Data Functions__

* *Simulated Data Generation*: Simulates realistic water quality sensor data.
* *WQI Computation*: Calculates the Water Quality Index from sensor data.
* *Sorting and Aggregation*: Offers sorting and data aggregation capabilities for analysis and reporting.

__Visualiations__

__APIs__

* *User Management*: Handles user registration, login, session management, and profile updates.
* *Data Retrieval*: Provides access to real-time and historical data endpoints.
* *Visualization*: Serves data optimized for visualization, supporting real-time updates and historical analysis.

## Technologies Used

* Node.js and Express for backend services;
* MongoDB for database management;
* D3.js and Materialize for frontend visualizations and user interface;
* CSV parsing for data import and analytics;
* Mongoose for object data modeling (ODM) to interact with MongoD; and
* Kafka for handling data streams and real-time processing.


