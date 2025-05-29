"use client";

import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Home as HomeIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  HighlightOff as HighlightOffIcon,
  Redeem as RedeemIcon,
  Equalizer as EqualizerIcon,
  EmojiEvents as EmojiEventsIcon,
  LocalOffer as LocalOfferIcon,
  DisabledByDefault as DisabledByDefaultIcon,
} from "@mui/icons-material";

import NextLink from "next/link";
import { usePathname } from "next/navigation";

const DrawerMenu = ({ drawerOpen, handleDrawerClose }) => {
  const pathname = usePathname();

  const drawerItems = [
    {
      label: "Asosiy sahifa",
      href: "/mainpage",
      icon: <HomeIcon color="info" />,
    },
    {
      label: "Aksiya",
      href: "/aksiya",
      icon: <LocalOfferIcon color="secondary" />,
    },
    {
      label: "Ariza qo'yish",
      href: "/ariza",
      icon: <AssignmentIcon color="success" />,
    },
    {
      label: "Topilgan buyumlar",
      href: "/topilgan",
      icon: <CheckCircleIcon color="success" />,
    },
    {
      label: "Yo‘qotilgan buyumlar",
      href: "/yoqoldi",
      icon: <HighlightOffIcon color="error" />,
    },
    {
      label: "Xadiya buyumlar",
      href: "/xadiya",
      icon: <RedeemIcon color="primary" />,
    },
    {
      label: "Statistika",
      href: "/statistika",
      icon: <EqualizerIcon color="primary" />,
    },
    {
      label: "Top Rating",
      href: "/rating",
      icon: <EmojiEventsIcon sx={{ color: "gold" }} />,
    },
    { label: "globus", href: "/globus" },
  ];

  return (
    <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerClose}>
      <Box
        role="presentation"
        onClick={handleDrawerClose}
        onKeyDown={handleDrawerClose}
        sx={{
          backgroundImage: "url('/menubar.png')",
          backgroundSize: "cover",
          height: "100vh",
          fontWeight: 700,
        }}
      >
        {/* Drawer yopish tugmasi */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <DisabledByDefaultIcon sx={{ cursor: "pointer" }} />
        </Box>

        <List>
          {drawerItems.map(({ label, href, icon }) => (
            <ListItem key={href} disablePadding>
              <ListItemButton
                component={NextLink}
                href={href}
                selected={pathname === href}
                sx={{
                  "&.Mui-selected": {
                    // HEX kod
                    backgroundColor: "rgba(0, 150, 136, 0.5)", // Tanlangan holatdagi rang
                    borderRadius: 6,
                    fontWeight: 700,
                    // RGBA — soya bilan
                    // RGBA — soya bilan
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "#e1f5fe", // Hover holatidagi rang
                  },
                  "&:hover": {
                    backgroundColor: "rgba(38, 166, 154, 0.5)",
                    borderRadius: 6, // Hover holatidagi rang
                  },
                }}
                onClick={handleDrawerClose}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default DrawerMenu;
