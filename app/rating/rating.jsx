"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  Grid,
  TextField,
  InputAdornment,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ChatIcon from "@mui/icons-material/Chat";
import SearchIcon from "@mui/icons-material/Search";

export default function TopUsersPage() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/allusers");
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error("Foydalanuvchilarni olishda xatolik:", error);
      }
    };

    const fetchFriends = async () => {
      try {
        const res = await fetch("/api/friendslist"); // misol uchun, do‘stlar ro‘yxati
        const data = await res.json();
        if (data.success) {
          setFriends(data.friends); // friends - array of friend user IDs
        }
      } catch (error) {
        console.error("Do‘stlarni olishda xatolik:", error);
      }
    };

    fetchUsers();
    fetchFriends();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleRequestFriend = async (friendId) => {
    try {
      const res = await fetch("/api/friendsRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ friendId }), // to‘g‘ri argument
      });

      if (res.ok) {
        setFriends((prev) => [...prev, friendId]);
        alert("Do‘stlik so‘rovi yuborildi!");
      }
    } catch (error) {
      console.error("Do‘st bo‘lishda xatolik:", error);
    }
  };

  const handleStartChat = (userId) => {
    window.location.href = `/chat/${userId}`;
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort(
    (a, b) => (b.points || 0) - (a.points || 0)
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Ro‘yxatdan o‘tgan foydalanuvchilar
      </Typography>

      <Box sx={{ maxWidth: 400, mx: "auto", mb: 4 }}>
        <TextField
          fullWidth
          label="Foydalanuvchini qidirish"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {sortedUsers.map((user, index) => {
          const isFriend = Array.isArray(friends) && friends.includes(user._id);

          return (
            <Grid item xs={6} sm={6} md={4} key={user._id}>
              <Card elevation={3} sx={{ textAlign: "center", p: 2 }}>
                <CardContent>
                  <Typography variant="h6">{user.name || "No Name"}</Typography>
                  <Avatar
                    src={
                      user.avatar || `https://i.pravatar.cc/150?u=${user._id}`
                    }
                    alt={user.name}
                    sx={{ width: 80, height: 80, margin: "auto", mb: 2 }}
                  />
                  <Chip
                    label={`#${index + 1}`}
                    color="secondary"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Ball: {user.points || 0}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center", gap: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<ChatIcon />}
                    onClick={() => handleStartChat(user._id)}
                  >
                    Bog‘lanish
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<PersonAddIcon />}
                    disabled={isFriend}
                    onClick={() => handleRequestFriend(user._id)} // to‘g‘ri funksiya nomi va argument
                  >
                    {isFriend ? "Do‘st" : "Do‘st bo‘lish"}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
