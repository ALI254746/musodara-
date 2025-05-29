"use client";

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
import { useState, useEffect } from "react";

const TopBar = ({ onDrawerOpen, onMsgClick, onNotClick, onProfileOpen }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch("/api/friendslist");
      const data = await res.json();
      setNotifications(data.notifications || []);
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
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
            <Badge badgeContent={unreadCount} color="error">
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
};

export default TopBar;
