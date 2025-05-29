"use client";

import {
  Popover,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  Stack,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import { useEffect, useState } from "react";

const NotificationPopover = ({ anchorEl, onClose }) => {
  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  // ✅ Foydalanuvchi ID ni olish
  const fetchUserId = async () => {
    try {
      const res = await fetch("/api/user");
      const data = await res.json();
      setUserId(data.user._id);
    } catch (error) {
      console.error("User ID olishda xatolik:", error);
    }
  };

  // ✅ Notificationlarni o‘qilgan qilish
  const markAsRead = async (notificationId) => {
    if (!userId) return;
    try {
      await fetch(`/api/notification/${notificationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      console.error("Notificationni o'qilgan deb belgilashda xatolik:", error);
    }
  };

  // ✅ Notificationlarni olib kelish
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/friendslist");
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Bildirishnomalarni olishda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Faqat ochilganda userId ni olib kelish
  useEffect(() => {
    if (open) {
      fetchUserId();
    }
  }, [open]);

  // ✅ User ID bor bo‘lsa, bildirishnomalarni olib kelish
  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  // ✅ Do‘stlikni qabul qilish
  const handleAccept = async (senderId, notificationId) => {
    try {
      await fetch("/api/friendsAccept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId, notificationId }),
      });
      fetchNotifications();
    } catch (error) {
      console.error("Qabul qilishda xatolik:", error);
    }
  };

  // ✅ Rad etish
  const handleReject = async (notificationId) => {
    try {
      await fetch("/api/friendsReject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });
      fetchNotifications();
    } catch (error) {
      console.error("Rad etishda xatolik:", error);
    }
  };

  // ✅ Tab bo‘yicha filter
  useEffect(() => {
    if (tabIndex === 1 && notifications.length > 0) {
      notifications
        .filter((notif) => !notif.read) // faqat o‘qilmaganlar
        .forEach((notif) => markAsRead(notif._id));
    }
  }, [tabIndex, notifications]); // tabIndex yoki notifications o‘zgarsa ishlaydi
  // ⬆️ JSX'dan oldin, hooksdan keyin joylashtiring
  const filteredNotifications = notifications.filter((notif) => {
    const createdAt = new Date(notif.createdAt);
    const now = new Date();
    const timeDiff = now.getTime() - createdAt.getTime();
    const isLast24Hours = timeDiff <= 24 * 60 * 60 * 1000; // 24 soat ichida

    if (tabIndex === 0) return notif.read === true && isLast24Hours; // All tab
    if (tabIndex === 1) return notif.read === false; // Unread tab
    return true;
  });
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return `${seconds} soniya oldin`;
    if (minutes < 60) return `${minutes} daqiqa oldin`;
    if (hours < 24) return `${hours} soat oldin`;
    return `${days} kun oldin`;
  };
  const unreadCount = notifications.filter(
    (notif) => notif.read === false
  ).length;

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
    >
      <Box sx={{ p: 2, width: 320 }}>
        <Typography variant="h6" gutterBottom>
          Bildirishnomalar
        </Typography>

        <Tabs
          value={tabIndex}
          onChange={(_, i) => setTabIndex(i)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2 }}
        >
          <Tab label="All" />
          <Tab label="Unread" />
        </Tabs>

        {loading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress />
          </Box>
        ) : filteredNotifications.length === 0 ? (
          <Typography>Bildirishnoma mavjud emas</Typography>
        ) : (
          <List>
            {filteredNotifications.map((notif) => (
              <ListItem key={notif._id} alignItems="flex-start">
                <Box width="100%">
                  <ListItemText
                    primary={
                      notif.type === "friend_request"
                        ? `${notif.from.name} sizga do‘stlik so‘rovi yubordi.`
                        : notif.type === "like"
                        ? `${notif.from.name} sizning postingizni yoqtirdi.`
                        : notif.type === "comment"
                        ? `${notif.from.name} sizning postingizga izoh qoldirdi.`
                        : notif.message
                    }
                    secondary={getTimeAgo(notif.createdAt)}
                  />

                  {notif.type === "friend_request" && (
                    <Stack direction="row" spacing={1} mt={1}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => handleAccept(notif.from._id, notif._id)}
                      >
                        Qabul qilish
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleReject(notif._id)}
                      >
                        Rad etish
                      </Button>
                    </Stack>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Popover>
  );
};

export default NotificationPopover;
