// components/navbar/AppNavbar.jsx
"use client";
import React from "react";
import TopBar from "./TopBar";
import ProfileDrawer from "./ProfileDrawer";
import NotificationPopover from "./NotificationPopover";
import MessagePopover from "./MessagePopover";
import DrawerMenu from "./DrawerMenu"; // Chap tomondagi drawer
const AppNavbar = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = React.useState(false);
  const [msgAnchorEl, setMsgAnchorEl] = React.useState(null);
  const [notAnchorEl, setNotAnchorEl] = React.useState(null);
  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  const handleMsgClick = (event) => setMsgAnchorEl(event.currentTarget);
  const handleNotClick = (event) => setNotAnchorEl(event.currentTarget);
  const handleProfileOpen = (event) => setProfileAnchorEl(event.currentTarget);

  return (
    <>
      <TopBar
        onDrawerOpen={() => setDrawerOpen(true)}
        onProfileOpen={() => setProfileDrawerOpen(true)}
        onMsgClick={setMsgAnchorEl}
        onNotClick={setNotAnchorEl}
      />
      {/*DRawer menu */}
      <DrawerMenu
        drawerOpen={drawerOpen}
        handleDrawerClose={handleDrawerClose}
      />
      <ProfileDrawer
        open={profileDrawerOpen}
        onClose={() => setProfileDrawerOpen(false)}
      />

      <MessagePopover
        anchorEl={msgAnchorEl}
        onClose={() => setMsgAnchorEl(null)}
      />

      <NotificationPopover
        anchorEl={notAnchorEl}
        onClose={() => setNotAnchorEl(null)}
      />
    </>
  );
};

export default AppNavbar;
