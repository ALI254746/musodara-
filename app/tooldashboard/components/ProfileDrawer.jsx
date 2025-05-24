import {
  Drawer,
  Box,
  Avatar,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Paper,
} from "@mui/material";
import {
  DisabledByDefault,
  Assignment,
  Settings,
  People,
  Logout,
} from "@mui/icons-material";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProfileDrawer = ({ open, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "GET", credentials: "include" });
    router.push("/login");
  };

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/user", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setUser(data.user);
      setLoading(false);
    }
    fetchUser();
  }, []);

  // Icon ranglari
  const iconColors = {
    "/myariza": "#1976d2", // ko‘k
    "/sozlamalar": "#388e3c", // yashil
    "/myfriend": "#f57c00", // to'q sariq
    logout: "#d32f2f", // qizil
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 300,
          p: 2,
          bgcolor: "#f5f7fa",
          height: "100%",
        }}
      >
        {/* Close icon */}
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={onClose}>
            <DisabledByDefault />
          </IconButton>
        </Box>

        {/* User info */}
        {!loading && user && (
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: 3,
              background: "#ffffff",
              border: "1px solid #e0e0e0",
              mb: 2,
              textAlign: "center",
            }}
          >
            <Avatar
              src={user?.avatar}
              sx={{
                width: 80,
                height: 80,
                margin: "auto",
                mb: 1,
                border: "2px solid #2196f3",
              }}
            >
              {user?.name?.[0]?.toUpperCase() || "U"}
            </Avatar>
            <Typography variant="h6" sx={{ color: "#333" }}>
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
            {user?.bio && (
              <Typography variant="body2" mt={1} color="text.secondary">
                {user.bio}
              </Typography>
            )}
            <Typography variant="caption" display="block" mt={1} color="gray">
              Ro‘yxatdan o‘tgan:{" "}
              {new Date(user.createdAt).toLocaleDateString("uz-UZ")}
            </Typography>
            <Box mt={1}>
              <Chip
                label={`⭐ Ballar: ${user.points || 0}`}
                color="primary"
                variant="outlined"
              />
            </Box>
          </Paper>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Navigation List */}
        <List>
          {[
            {
              href: "/myariza",
              icon: <Assignment />,
              text: "Mening Arizalarim",
              color: iconColors["/myariza"],
            },
            {
              href: "/sozlamalar",
              icon: <Settings />,
              text: "Sozlamalar",
              color: iconColors["/sozlamalar"],
            },
            {
              href: "/myfriend",
              icon: <People />,
              text: "My Friends",
              color: iconColors["/myfriend"],
            },
          ].map((item) => (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={NextLink}
                href={item.href}
                selected={pathname === item.href}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  color: pathname === item.href ? item.color : "#333",
                  backgroundColor:
                    pathname === item.href ? "#e3f2fd" : "transparent",
                  "&:hover": {
                    backgroundColor: "#e3f2fd",
                    color: item.color,
                  },
                }}
              >
                <ListItemIcon sx={{ color: item.color }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}

          {/* Logout */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                mt: 1,
                color: iconColors.logout,
                "&:hover": {
                  backgroundColor: "#ffebee",
                  color: iconColors.logout,
                },
              }}
            >
              <ListItemIcon sx={{ color: iconColors.logout }}>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Chiqish" />
            </ListItemButton>
          </ListItem>
        </List>

        {!loading && user?.updatedAt && (
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            align="center"
            mt={3}
          >
            Oxirgi yangilanish:{" "}
            {new Date(user.updatedAt).toLocaleDateString("uz-UZ")}
          </Typography>
        )}
      </Box>
    </Drawer>
  );
};

export default ProfileDrawer;
