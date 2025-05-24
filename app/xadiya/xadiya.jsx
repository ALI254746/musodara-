"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Drawer,
  IconButton,
  Avatar,
  TextField,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";
import CloseIcon from "@mui/icons-material/Close";

function timeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now - past) / 1000);
  if (diff < 60) return `${diff} sekund oldin`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minut oldin`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} soat oldin`;
  return `${Math.floor(diff / 86400)} kun oldin`;
}

export default function LostItemsPage() {
  const theme = useTheme();
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [likes, setLikes] = useState({});
  const [commentsCount, setCommentsCount] = useState({});
  const [commentsData, setCommentsData] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("all");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/ariza?status=Xadiya");
        const data = await res.json();
        const mappedData = data.map((item) => {
          const id = item._id;
          return {
            id,

            title: item.itemType,
            description: item.itemDescription,
            location: item.location,
            dateLost: item.date,
            image: item.image?.data?.data
              ? `data:${item.image.type};base64,${Buffer.from(
                  item.image.data.data
                ).toString("base64")}`
              : "/images/placeholder.png",
          };
        });

        setItems(mappedData);
        const initLikes = {},
          initComments = {},
          initCommentsData = {};
        mappedData.forEach((item) => {
          initLikes[item.id] = 0;
          initComments[item.id] = 0;
          initCommentsData[item.id] = [];
        });
        setLikes(initLikes);
        setCommentsCount(initComments);
        setCommentsData(initCommentsData);
      } catch (error) {
        console.error("Xatolik:", error);
      }
    };

    fetchItems();
  }, []);

  const filterItemsByTime = (items) => {
    const now = new Date();
    return items.filter((item) => {
      const itemDate = new Date(item.dateLost);
      if (selectedTimeFilter === "today") {
        return itemDate.toDateString() === now.toDateString();
      } else if (selectedTimeFilter === "weekly") {
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);
        return itemDate >= oneWeekAgo;
      } else if (selectedTimeFilter === "monthly") {
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(now.getMonth() - 1);
        return itemDate >= oneMonthAgo;
      } else {
        return true;
      }
    });
  };

  const filteredItems = filterItemsByTime(
    items.filter((item) => {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      );
    })
  );

  const handleTimeFilterChange = (event, newFilter) => {
    if (newFilter) setSelectedTimeFilter(newFilter);
  };

  const openCommentsDrawer = (itemId) => {
    setCurrentItemId(itemId);
    setDrawerOpen(true);
  };

  const closeCommentsDrawer = () => {
    setDrawerOpen(false);
    setCurrentItemId(null);
    setNewCommentText("");
  };

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;
    const comment = {
      id: Date.now(),
      user: "Foydalanuvchi",
      text: newCommentText.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    setCommentsData((prev) => ({
      ...prev,
      [currentItemId]: [...prev[currentItemId], comment],
    }));
    setCommentsCount((prev) => ({
      ...prev,
      [currentItemId]: prev[currentItemId] + 1,
    }));
    setNewCommentText("");
  };

  const handleLikeComment = (commentId) => {
    setCommentsData((prev) => ({
      ...prev,
      [currentItemId]: prev[currentItemId].map((c) =>
        c.id === commentId ? { ...c, likes: c.likes + 1 } : c
      ),
    }));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        textAlign="center"
        fontWeight="bold"
        gutterBottom
        color="primary"
      >
        Topilgan buyumlar
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        sx={{ mb: 3, backgroundColor: "#f9f9f9" }}
        placeholder="Qidiruv..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
        <ToggleButtonGroup
          value={selectedTimeFilter}
          exclusive
          onChange={handleTimeFilterChange}
          aria-label="time filter"
        >
          <ToggleButton value="all">Barchasi</ToggleButton>
          <ToggleButton value="today">Bugun</ToggleButton>
          <ToggleButton value="weekly">Haftalik</ToggleButton>
          <ToggleButton value="monthly">Oylik</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={3}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card
              sx={{
                display: "flex",
                maxWidth: "178px",
                flexDirection: "column",
                borderRadius: 3,
                boxShadow: 3,
                transition: "0.3s",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={item.image}
                alt={item.title}
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {item.title}
                </Typography>
                <Divider color="primary" />
                <Typography variant="body2" mt={1} color="text.secondary">
                  {item.description}
                </Typography>
                <Typography variant="body2" mt={1}>
                  <strong>Joy:</strong> {item.location}
                </Typography>
                <Typography variant="body2">
                  <strong>Sana:</strong> {item.dateLost}
                </Typography>
                <Divider color="primary" />
              </CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  px: 2,
                  pb: 2,
                }}
              >
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: 20 }}
                  onClick={() => openCommentsDrawer(item.id)}
                  startIcon={<CommentIcon />}
                >
                  ({commentsCount[item.id]})
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ borderRadius: 20 }}
                  onClick={() =>
                    setLikes((prev) => ({
                      ...prev,
                      [item.id]: prev[item.id] + 1,
                    }))
                  }
                  startIcon={<ThumbUpIcon />}
                >
                  ({likes[item.id]})
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={closeCommentsDrawer}
        PaperProps={{
          sx: {
            height: "60vh",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            p: 3,
            backgroundColor: "#fafafa",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Izohlar
          </Typography>
          <IconButton onClick={closeCommentsDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ overflowY: "auto", maxHeight: "calc(60vh - 160px)", mb: 2 }}>
          {currentItemId && commentsData[currentItemId]?.length > 0 ? (
            commentsData[currentItemId].map((comment) => (
              <Box
                key={comment.id}
                sx={{
                  mb: 2,
                  p: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#fff",
                }}
              >
                <Avatar sx={{ mr: 2 }}>{comment.user[0]}</Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {comment.user}
                  </Typography>
                  <Typography variant="body2" mb={0.5}>
                    {comment.text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {timeAgo(comment.createdAt)}
                  </Typography>
                </Box>
                <IconButton onClick={() => handleLikeComment(comment.id)}>
                  <ThumbUpIcon fontSize="small" />
                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                    {comment.likes}
                  </Typography>
                </IconButton>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Hozircha izohlar yo'q.
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Izoh yozing..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
          />
          <Button variant="contained" onClick={handleAddComment}>
            Yuborish
          </Button>
        </Box>
      </Drawer>
    </Container>
  );
}
