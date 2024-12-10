const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../Configuration/Config");
const Environment = require("../Configuration/Environment");

const UserService = function () {};

UserService.registerUserService = (input, output) => {
  const { name, email, mobile, gender, password, address, bankDetails, role } =
    input;

  const checkEmailQuery = `SELECT email FROM mangoByte.UserCredential WHERE email = ?`;

  const insertUserQuery = `INSERT INTO mangoByte.UserCredential 
    (name, email, mobile, gender, password, address, bankDetails, role) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    db.query(checkEmailQuery, [email], (err, results) => {
      if (err) {
        output(
          { error: { description: Environment.SERVER_ERROR_MESSAGE } },
          null
        );
        throw err;
      }

      if (results.length > 0) {
        return output(
          {
            error: { description: "Email ID already exists." },
            statusCode: 402,
          },
          null
        );
      }

      db.query(
        insertUserQuery,
        [name, email, mobile, gender, password, address, bankDetails, role],
        (err, result) => {
          if (err) {
            output(
              { error: { description: Environment.SERVER_ERROR_MESSAGE } },
              null
            );
            throw err;
          }

          output(null, { message: "User registered successfully" });
        }
      );
    });
  } catch (e) {
    output({ error: { description: Environment.SERVER_ERROR_MESSAGE } }, null);
    throw e;
  }
};

UserService.loginUserService = (input, output) => {
  const { email, password } = input;

  if (!email || !password) {
    return output(
      {
        error: {
          description: "Email and password are required",
          statusCode: 400,
        },
      },
      null
    );
  }

  const query = `SELECT * FROM UserCredential WHERE email = ?`;
  db.query(query, [email], (err, results) => {
    if (err) {
      return output(
        { error: { description: "Database query error", statusCode: 500 } },
        null
      );
    }

    if (results.length === 0) {
      return output(
        { error: { description: "Email ID not found", statusCode: 404 } },
        null
      );
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return output(
          {
            error: {
              description: "Error comparing passwords",
              statusCode: 500,
            },
          },
          null
        );
      }

      if (!isMatch) {
        return output(
          { error: { description: "Invalid password", statusCode: 401 } },
          null
        );
      }

      const token = jwt.sign(
        { userId: user.userId, email: user.email },
        Environment.JWT_SECRET_KEY,
        { expiresIn: "240m" }
      );

      const updateQuery = `UPDATE UserCredential SET token = ? WHERE email = ?`;
      db.query(updateQuery, [token, email], (err, result) => {
        if (err) {
          return output(
            { error: { description: "Error storing token", statusCode: 500 } },
            null
          );
        }

        const response = {
          userId: user.userId,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          gender: user.gender,
          token: token,
          role: user.role,
          address: user.address,
          bankDetails: user.bankDetails,
        };

        output(null, response);
      });
    });
  });
};

UserService.getUserService = (userId, callback) => {
  const query = `SELECT * FROM UserCredential WHERE userId = ?`;

  db.query(query, userId, (err, results) => {
    if (err) {
      return callback(
        { description: "Database query error", statusCode: 500 },
        null
      );
    }

    if (results.length === 0) {
      return callback({ description: "No users found", statusCode: 404 }, null);
    }

    return callback(null, results);
  });
};

UserService.getAllUserService = (callback) => {
  const query = `SELECT * FROM UserCredential`;

  db.query(query, (err, results) => {
    if (err) {
      return callback(
        { description: "Database query error", statusCode: 500 },
        null
      );
    }

    if (results.length === 0) {
      return callback({ description: "No users found", statusCode: 404 }, null);
    }

    return callback(null, results);
  });
};

UserService.updateUserService = (input, callback) => {
  const { userId, name, email, mobile, gender, address, bankDetails } = input;

  let updateFields = [];
  let updateValues = [];

  if (name) {
    updateFields.push("name = ?");
    updateValues.push(name);
  }
  if (email) {
    updateFields.push("email = ?");
    updateValues.push(email);
  }
  if (mobile) {
    updateFields.push("mobile = ?");
    updateValues.push(mobile);
  }
  if (gender) {
    updateFields.push("gender = ?");
    updateValues.push(gender);
  }
  if (address) {
    updateFields.push("address = ?");
    updateValues.push(address);
  }
  if (bankDetails) {
    updateFields.push("bankDetails = ?");
    updateValues.push(bankDetails);
  }

  if (updateFields.length === 0) {
    return callback(
      { description: "No fields to update", statusCode: 400 },
      null
    );
  }

  const updateQuery = `UPDATE UserCredential SET ${updateFields.join(
    ", "
  )} WHERE userId = ?`;
  updateValues.push(userId);

  db.query(updateQuery, updateValues, (err, result) => {
    if (err) {
      return callback(
        { description: "Database query error", statusCode: 500 },
        null
      );
    }

    if (result.affectedRows === 0) {
      return callback(
        { description: "User not found or no changes made", statusCode: 404 },
        null
      );
    }

    return callback(null, {
      userId,
      name,
      email,
      mobile,
      gender,
      address,
      bankDetails,
    });
  });
};

module.exports = UserService;
