# AQUASENTINEL

Aquasentinel is a loT-based web application designed to provide users with water quality information and visualisation. It enables users to monitor and analyze water quality in real-time. The system collects data from various water quality parameters and provides insights into the overall water health.

## To run AQUASENTINEL:

**A .env file is required to connect to the database and enable the app to run. Paste the file into the project folder.**

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

|Main Features|Summary|
|-|-|
|*__Interactive Dashboards__*|Real-time and historical data visualisations for water quality monitoring.|
|*__Data Filtering__*|Customizable views based on time and location filters.|
|*__User Authentication__*|Secure login system to user-specific interaction with the platform.|
|*__Alerts System__*|Automated notifications for critical water quality changes.|

|Data Functions|Summary|
|-|-|
|*__Simulated Data Generations__*|Simulates realistic water quality sensor data.|
|*__WQI Computation__*|Calculates the Water Quality Index from sensor data.|
|*__Sorting and Aggregation__*|Offers sorting and data aggregation capabilities for analysis and reporting.|

|APIS|Summary|
|-|-|
|*__User Management__*|Handles user registration, login, session management, and profile updates.|
|*__Data Retrieval__*|Provides access to real-time and historical data endpoints.|
|*__Visualization__*|Serves data optimized for visualization, supporting real-time updates and historical analysis.|

|Technologies Used|
|-|
|*Node.js* and *Express* for backend services.|
|*MongoDB* for database management.|
|*D3.js* and *Materialize* for frontend visualizations and user interface.|
|*CSV parsing* for data import and analytics.|
|*Mongoose* for object data modeling (ODM) to interact with MongoDB.|
|*Kafka* for handling data streams and real-time processing.|


