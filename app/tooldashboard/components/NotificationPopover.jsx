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
} from "@mui/material";
import { useEffect, useState } from "react";

const NotificationPopover = ({ anchorEl, onClose }) => {
  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

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

  // ✅ Notificationni o‘qilgan qilish
  const markAsRead = async (notificationId) => {
    console.log("Notif ID:", notificationId);
    console.log("User ID:", userId);
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
      const unread = (data.notifications || []).filter((notif) => !notif.read);
      unread.forEach((notif) => markAsRead(notif._id));
      setNotifications(unread);
    } catch (error) {
      console.error("Bildirishnomalarni olishda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ useEffect faqat ochilganda va userId mavjud bo‘lsa ishga tushadi
  useEffect(() => {
    if (open) {
      fetchUserId(); // userId ni olib kelamiz
    }
  }, [open]);

  useEffect(() => {
    if (userId) {
      fetchNotifications(); // faqat userId bo‘lsa notiflarni ol
    }
  }, [userId]);

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

        {loading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress />
          </Box>
        ) : notifications.length === 0 ? (
          <Typography>Bildirishnoma mavjud emas</Typography>
        ) : (
          <List>
            {notifications
              .filter((notif) => !notif.read)
              .map((notif) => (
                <ListItem key={notif._id} alignItems="flex-start">
                  <Box width="100%">
                    <ListItemText
                      primary={notif.message}
                      secondary={new Date(notif.createdAt).toLocaleString()}
                    />

                    {/* Do'stlik so'rovi bo'lsa tugmalar chiqadi */}
                    {notif.type === "friend_request" && (
                      <Stack direction="row" spacing={1} mt={1}>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() =>
                            handleAccept(notif.from._id, notif._id)
                          }
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

                    {/* Like turi uchun qo'shimcha matn (ixtiyoriy) */}
                    {notif.type === "like" && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        Sizning postlaringizdan biriga like bosildi.
                      </Typography>
                    )}

                    {/* Agar boshqa turdagi xabarlar ham bo‘lsa, shu yerga qo‘shib ketish mumkin */}
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
