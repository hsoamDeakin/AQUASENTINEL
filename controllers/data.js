// Assume you have some logic to fetch data, here we simulate it
const fetchData = () => {
    // Replace this with your actual data fetching logic
    return [10, 20, 30, 40, 50];
  };
  
  const getData = (req, res, next) => {
    const data = fetchData();
    res.locals.data = data;
    next();
  };
  
  module.exports = { getData };
  