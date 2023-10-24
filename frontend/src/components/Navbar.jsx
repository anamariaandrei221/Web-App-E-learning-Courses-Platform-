import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import CalculateIcon from "@mui/icons-material/Calculate";
import { useNavigate } from "react-router-dom";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

function Navbar({ pages, onLogout, role, user, requestNr }) {
  const settings = ["Logout"];
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElProfile, setAnchorElProfile] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenProfileMenu = (event) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorElProfile(null);
  };

  const handleLogout = () => {
    onLogout(); // Call the logout function passed from the parent component
  };

  const renderUserDetails = () => {
    if (user) {
      return [
        <Typography key="lastname" variant="body1">
          <span style={{ fontWeight: "bold", marginRight: "2px" }}>Nume:</span>
          {user.lastName}
        </Typography>,
        <Typography key="firstname" variant="body1">
          <span style={{ fontWeight: "bold", marginRight: "2px" }}>
            Prenume:
          </span>{" "}
          {user.firstName}
        </Typography>,
        <Typography key="email" variant="body1">
          <span style={{ fontWeight: "bold", marginRight: "2px" }}>Email:</span>
          {user.userEmail}
        </Typography>,
        <Typography key="role" variant="body1">
          <span style={{ fontWeight: "bold", marginRight: "2px" }}>Rol:</span>
          {user.role}
        </Typography>,
      ];
    } else {
      return null;
    }
  };

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <CalculateIcon fontSize="large" sx={{ display: "flex", mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: "flex",
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Link
              style={{ textDecoration: "none", color: "white" }}
              to={`/${role}/${pages[0]}`}
            >
              MathEDU
            </Link>
          </Typography>

          <Box sx={{ flexGrow: 1, display: "flex" }}>
            {pages.map((page) => (
              <Button
                key={page}
                sx={{
                  my: 2,

                  display: "block",

                  float: "right",
                }}
              >
                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  to={`/${role}/${page.replace(/\s/g, "")}`}
                >
                  {page}
                </Link>
              </Button>
            ))}
          </Box>
          {pages.length > 0 && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Utilizator">
                <IconButton
                  onClick={handleOpenProfileMenu}
                  sx={{ p: 0 }}
                  style={{ color: "white", marginRight: "10px" }}
                >
                  <AccountCircleIcon
                    fontSize="medium"
                    className="profile--icon"
                  ></AccountCircleIcon>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{
                  mt: "45px",
                  "& .MuiPaper-root": {
                    padding: "10px",
                  },
                }}
                id="menu-profile"
                anchorEl={anchorElProfile}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElProfile)}
                onClose={handleCloseProfileMenu}
              >
                {renderUserDetails()}
              </Menu>

              <Tooltip title="Setări">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <SettingsIcon
                    fontSize="medium"
                    className="settings--icon"
                  ></SettingsIcon>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      handleLogout();
                      navigate("/");
                    }}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
