// components/navbar/TopBar.jsx
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Box,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Mail as MailIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
} from "@mui/icons-material";

const TopBar = ({ onDrawerOpen, onMsgClick, onNotClick, onProfileOpen }) => (
  <AppBar position="static">
    <Toolbar>
      <IconButton edge="start" color="inherit" onClick={onDrawerOpen}>
        <MenuIcon fontSize="large" />
      </IconButton>
      <Typography variant="h6" noWrap>
        Found or Lost
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ display: "flex" }}>
        <IconButton
          color="inherit"
          onClick={(e) => onMsgClick(e.currentTarget)}
        >
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <IconButton
          color="inherit"
          onClick={(e) => onNotClick(e.currentTarget)}
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton color="inherit" onClick={onProfileOpen}>
          <AccountCircle />
        </IconButton>
      </Box>
    </Toolbar>
  </AppBar>
);

export default TopBar;
