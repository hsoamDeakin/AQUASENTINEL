# AQUASENTINEL

Our project AQUASENTINEL is a web application that provides users with water quality information and visualisations. Users can use Aquasentinel to receive up to date and real-time information about the water sources nearby to them. Measurements that are provided with the water quality data include pH, Turbidity and Temperature.

Our web app contains numerous pages, including a home page, a registration page, a login page, a visualisation page, and a real-time streaming page.


## To run AQUASENTINEL:

### Copy the below contents into a .env file and add to project. A .env file is required to connect to the database and enable the app to run. 
```
DB_URI="mongodb+srv://s213067525:Xq2BY9gMGb72lyyL@cluster0.ryplpya.mongodb.net/"
dataCount=1000
FILE_PATH=./dataset/water_potability.csv
COLUMN_NAMES=ph,Organic_carbon,Turbidity,Solids,Trihalomethanes
```

### In console, run:
```
npm start
```
