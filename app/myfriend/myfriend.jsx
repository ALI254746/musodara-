"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Button,
} from "@mui/material";
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Search as SearchIcon,
  Chat as ChatIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";

export default function MyFriendsPage() {
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFriendsAndRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/friendslist");
      const data = await res.json();

      // Filter notification types
      const friendRequests = (data.notifications || []).filter(
        (n) => n.type === "friend_request"
      );

      setFriends(data.friends || []);
      setRequests(friendRequests);
    } catch (err) {
      console.error("Maʼlumotlarni olishda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (senderId, notificationId) => {
    try {
      await fetch("/api/friendsAccept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId, notificationId }),
      });
      fetchFriendsAndRequests();
    } catch (err) {
      console.error("Qabul qilishda xatolik:", err);
    }
  };

  const handleReject = async (notificationId) => {
    try {
      await fetch("/api/friendsReject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });
      fetchFriendsAndRequests();
    } catch (err) {
      console.error("Rad etishda xatolik:", err);
    }
  };

  useEffect(() => {
    fetchFriendsAndRequests();
  }, []);

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 900, mx: "auto" }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={2}>
        <PeopleIcon fontSize="large" sx={{ mr: 1 }} />
        <Typography variant="h5">Mening Do‘stlarim</Typography>
        <IconButton sx={{ ml: "auto" }}>
          <PersonAddIcon />
        </IconButton>
      </Box>

      {/* Qidiruv */}
      <Box display="flex" alignItems="center" mb={3}>
        <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
        <TextField
          placeholder="Do‘stlarni qidirish..."
          variant="standard"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {/* Kelayotgan so‘rovlar */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Kelayotgan so‘rovlar
        </Typography>
        <List>
          {requests.length === 0 ? (
            <Typography color="text.secondary">So‘rovlar yo‘q</Typography>
          ) : (
            requests.map((req) => (
              <ListItem
                key={req._id}
                sx={{ p: 1, borderRadius: 2, mb: 1, bgcolor: "#f5f5f5" }}
              >
                <ListItemAvatar>
                  <Avatar src={req.from.avatar}>
                    {req.from.name?.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={req.from.name}
                  secondary={new Date(req.createdAt).toLocaleString()}
                />
                <ListItemSecondaryAction>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={() => handleAccept(req.from._id, req._id)}
                    sx={{ mr: 1 }}
                  >
                    Qabul
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleReject(req._id)}
                  >
                    Rad et
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          )}
        </List>
      </Box>

      {/* Do‘stlar ro‘yxati */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Do‘stlar Ro‘yxati
        </Typography>
        <List>
          {filteredFriends.length === 0 ? (
            <Typography color="text.secondary">Do‘stlar topilmadi</Typography>
          ) : (
            filteredFriends.map((friend) => (
              <ListItem
                key={friend._id}
                sx={{ p: 1, mb: 1, borderRadius: 2, bgcolor: "#f5f5f5" }}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    variant="dot"
                    color={friend.online ? "success" : "default"}
                  >
                    <Avatar src={friend.avatar}>
                      {friend.name?.charAt(0)}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText primary={friend.name} />
                <ListItemSecondaryAction>
                  <IconButton sx={{ color: "primary.main" }}>
                    <ChatIcon />
                  </IconButton>
                  <IconButton sx={{ color: "secondary.main" }}>
                    <AccountCircleIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          )}
        </List>
      </Box>
    </Box>
  );
}
