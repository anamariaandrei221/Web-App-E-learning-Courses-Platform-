import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FilterIcon from "@mui/icons-material/Filter";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

const Sidebar = ({ handleAddCourse, handleSearch, page }) => {
  const [searchValue, setSearchValue] = useState("");
  const [classValue, setClassValue] = useState("");
  const [difficultyValue, setDifficultyValue] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (difficultyValue) handleSearch(searchValue, classValue, difficultyValue);
    else handleSearch(searchValue, classValue, isChecked);
  }, [searchValue, classValue, difficultyValue, isChecked]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
  };

  const handleClassChange = (event) => {
    const value = event.target.value;
    setClassValue(value);
  };

  const handleDifficultyChange = (event) => {
    const value = event.target.value;
    setDifficultyValue(value);
  };

  const handleCheckboxChange = (event) => {
    const value = event.target.checked;
    setIsChecked(value);
  };

  return (
    <div className="sidebar">
      <TextField
        style={{ marginBottom: "2px", width: "200px" }}
        value={searchValue}
        onChange={handleSearchChange}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon style={{ color: "#1976d2" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#1976d2",
            },
            "&:hover fieldset": {
              borderColor: "#1976d2",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1976d2",
            },
          },
        }}
      />

      <FormControl
        variant="standard"
        sx={{ m: 1, minWidth: 190, marginTop: 2 }}
      >
        <InputLabel id="class-select-label" sx={{ color: "#1976d2" }}>
          Clasa
        </InputLabel>
        <Select
          labelId="class-select-label"
          id="class-select"
          label="Clasa"
          value={classValue}
          onChange={handleClassChange}
          sx={{ color: "#1976d2 !important" }}
        >
          <MenuItem value="">
            <em>Fără</em>
          </MenuItem>
          {Array.from({ length: 12 }, (_, i) => (
            <MenuItem value={i + 1} key={i + 1}>
              {i + 1}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {page !== "tests" && (
        <FormControlLabel
          sx={{
            minWidth: 190,
            marginTop: 2,
          }}
          style={{ marginLeft: "1px" }}
          control={
            <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
          }
          label={
            <span style={{ color: "rgb(25, 118, 210)" }}>Conțin teste</span>
          }
        />
      )}

      {page === "courses" && (
        <div>
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddCourse}
            style={{ marginTop: "20px", marginLeft: "5px" }}
          >
            Adaugă curs
          </Button>
        </div>
      )}

      {page === "tests" && (
        <FormControl
          variant="standard"
          sx={{ m: 1, minWidth: 190, marginTop: 2 }}
        >
          <InputLabel id="difficulty-select-label" sx={{ color: "#1976d2" }}>
            Dificultate
          </InputLabel>
          <Select
            labelId="difficulty-select-label"
            id="difficulty-select"
            label="Dificultate"
            value={difficultyValue}
            onChange={handleDifficultyChange}
            sx={{ color: "#1976d2 !important" }}
          >
            <MenuItem value="">
              <em>Fără</em>
            </MenuItem>
            <MenuItem value="usor" key="usor">
              Ușor
            </MenuItem>
            <MenuItem value="mediu" key="mediu">
              Mediu
            </MenuItem>
            <MenuItem value="greu" key="greu">
              Greu
            </MenuItem>
          </Select>
        </FormControl>
      )}
    </div>
  );
};

export default Sidebar;
