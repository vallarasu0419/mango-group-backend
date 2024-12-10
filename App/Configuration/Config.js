const mysql = require("mysql");
const bcrypt = require("bcrypt");
const Environment = require("./Environment");

const db = mysql.createPool({
  host: Environment.DATABASEHOST,
  user: Environment.DBUSERNAME,
  password: Environment.DBPASSWORD,
  database: Environment.DATABASENAME,
  port: Environment.DATABASEPORT,
  multipleStatements: true,
  connectionLimit: 20,
  queueLimit: 5,
});

let createUserCredential = `CREATE TABLE IF NOT EXISTS UserCredential (
  userId INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  mobile VARCHAR(15) NOT NULL,
  gender VARCHAR(15),
  address VARCHAR(255),
  bankDetails TEXT,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  token VARCHAR(255),
  PRIMARY KEY (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;`;

let createQuestion = `CREATE TABLE IF NOT EXISTS Question (
  questionId INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  createDate DATE,
  status VARCHAR(255) NOT NULL,
  documents  VARCHAR(255),
  userId INT NOT NULL,
  PRIMARY KEY (questionId),
  FOREIGN KEY (userId) REFERENCES UserCredential(userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;`;

console.log("Connected!");

try {
  db.query(createUserCredential, function (err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

  db.query(createQuestion, function (err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

  const insertAdmin = async () => {
    const hashedPassword = await bcrypt.hash("admin@123", 10);
    const adminQuery = `INSERT IGNORE INTO UserCredential 
      (name, email, mobile, gender, address, bankDetails, password, role) 
      VALUES ('admin', 'info@admin.com', '1234567890', NULL, NULL, NULL, ?, 'ADMIN')`;

    db.query(adminQuery, [hashedPassword], function (err, results, fields) {
      if (err) {
        console.log("Error inserting admin:", err.message);
      } else {
        console.log("Admin user inserted or already exists.");
      }
    });
  };

  insertAdmin();
} catch (e) {
  console.log(e);
  throw e;
}

module.exports = db;
