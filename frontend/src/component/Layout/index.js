import React from "react";
import "./index.css";
import { AppBar, Container, IconButton, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Box } from "@mui/system";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LinkIcon from "@mui/icons-material/Link";
import ArticleIcon from "@mui/icons-material/Article";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useLocation, useNavigate } from "react-router-dom";
import { path } from "../..";

export default function Layout({ children }) {
  const [open, setOpen] = React.useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const toggleDrawer = () => {
    setOpen(!open);
  };

  function handleChange(event, newValue) {
    navigate({
      pathname: newValue,
    });
  }
  return (
    <>
      <AppBar position="relative" open={open}>
        <Toolbar
          sx={{
            pr: "24px",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Gestion des quittances de loyer
          </Typography>
          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box paddingTop="24px" bgcolor="grey.200" minHeight="calc(100vh - 56px)">
        <Container fixed>{children}</Container>
      </Box>

      <Box position="absolute" bottom={0} left={0} right={0} bgcolor="white">
        <Tabs value={location.pathname} onChange={handleChange} variant="fullWidth">
          <Tab value={path.quittance} icon={<ArticleIcon />} label="QUITTANCES" />
          <Tab value={path.bails} icon={<LinkIcon />} label="BAILS" />
          <Tab value={path.locataires} icon={<PeopleAltIcon />} label="LOCATAIRES" />
        </Tabs>
      </Box>
    </>
  );
}
