const Environment = require("../Configuration/Environment");
const QuestionService = require("../Service/QuestionService");

exports.createQuestion = (req, res) => {
  try {
    const { title, description, userId, status } = req.body;

    if (!title || !description || !userId || !status) {
      return res.status(400).json({
        error: "All fields are required.",
      });
    }

    QuestionService.createQuestionService(
      { title, description, status, userId },
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.description });
        }
        res.status(200).json({ message: "Task created successfully!" });
      }
    );
  } catch (e) {
    res.status(500).json({
      error: Environment.SERVER_ERROR_MESSAGE,
    });
  }
};

exports.getAllQuestion = (req, res) => {
  try {
    QuestionService.getAllQuestionService(req, (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err.message || "An error occurred while fetching the task.",
        });
      }

      if (!result) {
        return res.status(404).json({
          error: "Question not found.",
        });
      }

      res.status(200).json(result);
    });
  } catch (e) {
    res.status(500).json({
      error: Environment.SERVER_ERROR_MESSAGE,
    });
  }
};

exports.getQuestion = (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        error: "userId ID is required.",
      });
    }

    QuestionService.getQuestionService(userId, (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err.message || "An error occurred while fetching the task.",
        });
      }

      if (!result) {
        return res.status(404).json({
          error: "Question not found.",
        });
      }

      res.status(200).json(result);
    });
  } catch (e) {
    res.status(500).json({
      error: Environment.SERVER_ERROR_MESSAGE,
    });
  }
};

exports.updateQuestion = (req, res) => {
  try {
    const { questionId, status } = req.body;
    const imgUrl = "/Docs/" + req.file.filename;
    if (!questionId) {
      return res.status(400).json({
        error: "Question ID is required.",
      });
    }

    if (!imgUrl && !status) {
      return res.status(400).json({
        error: "At least one field (file or status) is required to update.",
      });
    }

    QuestionService.updateQuestionService(
      questionId,
      { imgUrl, status },
      (err, result) => {
        if (err) {
          return res.status(500).json({
            error:
              err.message || "An error occurred while updating the Question.",
          });
        }

        if (!result) {
          return res.status(404).json({
            error: "Question not found.",
          });
        }

        res.status(200).json({
          message: "Question updated successfully!",
        });
      }
    );
  } catch (e) {
    console.error("Unexpected error:", e);
    res.status(500).json({
      error: "An unexpected error occurred while updating the Question.",
    });
  }
};
