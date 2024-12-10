const db = require("../Configuration/Config");
const Environment = require("../Configuration/Environment");

exports.createQuestionService = (questionData, output) => {
  const { title, description, dueDate, status, userId } = questionData;

  const query = `INSERT INTO Question (title, description, createDate, status, userId) VALUES (?, ?, ?, ?, ?)`;

  db.query(
    query,
    [title, description, (createDate = new Date()), status, userId],
    (err, result) => {
      if (err) {
        return output(
          { error: { description: Environment.SERVER_ERROR_MESSAGE } },
          null
        );
      }

      output(null, {
        questionId: result.insertId,
        title,
        description,
        dueDate,
        status,
        userId,
      });
    }
  );
};

exports.getAllQuestionService = (input, output) => {
  const query = `SELECT 
    Question.questionId,
    Question.title,
    Question.description,
    Question.createDate,
    Question.status,
    Question.documents,
    Question.userId,
    Question.documents,
    UserCredential.name
FROM 
    Question
JOIN 
    UserCredential 
ON 
    Question.userId = UserCredential.userId;
  `;

  db.query(query, (err, result) => {
    if (err) {
      return output(
        { error: { description: Environment.SERVER_ERROR_MESSAGE } },
        null
      );
    }

    if (result.length === 0) {
      return output(null, null);
    }

    output(null, result);
  });
};

exports.getQuestionService = (userId, output) => {
  const query = `SELECT * FROM Question WHERE userId = ?`;

  db.query(query, [userId], (err, result) => {
    if (err) {
      return output(
        { error: { description: Environment.SERVER_ERROR_MESSAGE } },
        null
      );
    }

    if (result.length === 0) {
      return output(null, null);
    }

    output(null, result);
  });
};

exports.updateQuestionService = (questionId, questionData, output) => {
  const { imgUrl, status } = questionData;

  let query = `UPDATE Question SET status = ?, documents = ? WHERE questionId = ?`;

  db.query(query, [status, imgUrl, questionId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return output(
        { error: { description: "Database error: " + err.message } },
        null
      );
    }
    if (result.affectedRows === 0) {
      return output(null, null);
    }
    output(null, { questionId, ...questionData });
  });
};
