import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
export default function QuestionInput({
  number,
  onDelete,
  question,
  answers,
  correctAnswer,
  onQuestionChange,
  onAnswerChange,
  onCheckboxChange,
}) {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const handleDelete = () => {
    onDelete();
  };

  const handleQuestionChange = (event) => {
    onQuestionChange(event.target.value);
  };

  const handleAnswerChange = (answerIndex, event) => {
    onAnswerChange(answerIndex, event.target.value);
  };

  const handleCheckboxChange = (event, answer) => {
    onCheckboxChange(answer);
  };

  return (
    <Card className="card--question">
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          justifyContent={"space-between"}
        >
          <Typography variant="p" component="div">
            Întrebarea {number}
          </Typography>
          <Box>
            <IconButton onClick={handleExpand}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        {expanded && (
          <div style={{ maxHeight: "200px", overflow: "auto" }}>
            <TextField
              label="Enunț"
              variant="outlined"
              fullWidth
              margin="normal"
              size="small"
              multiline
              rows={2}
              value={question}
              onChange={handleQuestionChange}
            />
            {answers.map((answer, index) => (
              <Box key={index} display="flex" alignItems="center">
                <FormControlLabel
                  control={
                    <Radio
                      checked={correctAnswer === answer}
                      onChange={(event) => handleCheckboxChange(event, answer)}
                      value={answer}
                    />
                  }
                />
                <TextField
                  label={`Răspuns ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={answer}
                  onChange={(event) => handleAnswerChange(index, event)}
                />
              </Box>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
