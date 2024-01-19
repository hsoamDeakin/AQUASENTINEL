
let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('userDB');

db.serialize(function(){
  db.run("CREATE TABLE IF NOT EXISTS Register (firstname TEXT, lastname TEXT, username TEXT UNIQUE, password TEXT)");
  
});

    
  db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Database connection closed.');
    });
 