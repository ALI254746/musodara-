"use client"; //yoqldi.jsx
import CommentDrawer from "./commentDrawer";
import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Container,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import PhoneIcon from "@mui/icons-material/Phone";

import InfoIcon from "@mui/icons-material/Info";
import FaceIcon from "@mui/icons-material/Face";
import LocationOnIcon from "@mui/icons-material/LocationOn"; // Detail uchun
export default function LostItemsPage() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [commentOpen, setCommentOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsData, setCommentsData] = useState({});
  // 🔁 API'dan ma'lumotni olish
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/ariza?status=Xadiya", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error("Ma'lumotlarni olishda xatolik yuz berdi");
        }
        // Ma'lumotlarni JSON formatiga o‘girish
        // console.log("API dan olingan ma'lumotlar:", res);
        const data = await res.json();
        console.log(data);
        const mappedData = data.map((item) => ({
          id: item._id,
          fullName: item.fullName,
          title: item.itemType,
          description: item.itemDescription,
          location: item.location,
          dateLost: item.date,
          image: item.image?.data?.data
            ? `data:${item.image.type};base64,${Buffer.from(
                item.image.data.data
              ).toString("base64")}`
            : "/images/placeholder.png", // agar rasm yo‘q bo‘lsa
          contactInfo: `Telefon: ${item.phone}`,
          likeCount: item.likeCount,
          isLiked: item.isLikedByCurrentUser,
        }));

        setItems(mappedData);
      } catch (error) {
        console.error("Ma'lumot olishda xatolik:", error);
      }
    };

    fetchItems();
  }, []);

  // Vaqt bo‘yicha filtrlash
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
    setSelectedTimeFilter(newFilter);
  };

  const handleDetailOpen = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleDetailClose = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleContact = (item) => {
    alert(`Kontakt ma’lumotlari:\n${item.contactInfo}`);
  };
  //like yuborilishi
  const handleLike = async (itemId) => {
    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: itemId }),
      });

      const data = await response.json();

      if (response.ok) {
        // 🔁 likeCount va isLiked holatini yangilaymiz
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  likeCount: data.likeCount,
                  isLiked: data.isLiked,
                }
              : item
          )
        );
      } else {
        console.error("Xatolik:", data.message || data.error);
      }
    } catch (error) {
      console.log("Server xatolik:", error);
    }
  };
  const handleCommentSubmit = async (text, itemId) => {
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          postId: itemId,
        }),
      });

      if (!res.ok) {
        throw new Error("Komment yuborishda xatolik");
      }

      const data = await res.json();

      // Optional: userga bildirishnoma berish
      console.log("Comment yuborildi:", data);
      const newComments = await fetchComments(itemId);
      setComments(newComments);
    } catch (error) {
      console.log(error.message);
    }
  };
  const fetchComments = useCallback(async (itemId) => {
    try {
      const res = await fetch(`/api/comments?postId=${itemId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Kommentlarni olishda xatolik yuz berdi");
      }

      const data = await res.json();
      setCommentsData((prev) => ({
        ...prev,
        [itemId]: data,
      }));
      console.log("Kommentlar:", data);
      return data; // agar komponentda ishlatmoqchi bo‘lsangiz
    } catch (error) {
      console.log(error.message);
    }
  }, []);
  // Comment drawer ochilganda commentlarni yuklash
  const openComments = async (item) => {
    setSelectedItem(item);
    await fetchComments(item.id);
    setCommentOpen(true);
  };

  function formatDate(dateLost) {
    const date = new Date(dateLost);
    return date.toLocaleDateString("uz-UZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  function capitalizeWords(str) {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Xadiya buyumlar
      </Typography>

      {/* Qidiruv */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
        <TextField
          label="Qidirish..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: { xs: "100%", sm: 400 } }}
        />
      </Box>

      {/* Vaqt bo‘yicha filter */}
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

      {/* Buyumlar ro'yxati */}
      <Grid container spacing={1}>
        {filteredItems.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                display: "flex",
                maxWidth: "178px",
                height: 370,
                flexDirection: "column",
                borderRadius: 6,
                boxShadow: 5,
                transition: "0.3s",

                "&:hover": { boxShadow: 2, color: "primary.main" },
              }}
            >
              <Box margin={1} sx={{ flexGrow: 1 }}>
                <Box
                  sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <FaceIcon color="primary" />
                  <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {item.fullName.toUpperCase()}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 150,
                    height: 120,
                    overflow: "hidden",
                    px: 1,
                  }}
                >
                  <CardMedia
                    component="img"
                    image={item.image}
                    alt={item.title}
                    sx={{
                      width: "100%",
                      borderRadius: 3,
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 2, px: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold" noWrap>
                    {item.title.toUpperCase()}
                  </Typography>
                  <Typography variant="body2" color="black" noWrap>
                    {capitalizeWords(item.description)}
                  </Typography>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="black"
                      fontWeight={"bold"}
                      mt={2}
                      px={-2}
                      noWrap
                    >
                      <LocationOnIcon />
                      {capitalizeWords(item.location)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="end">
                    {" "}
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {formatDate(item.dateLost)}
                    </Typography>
                  </Box>
                </CardContent>

                <Box
                  sx={{
                    pb: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 0,
                    flexWrap: "wrap",
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleDetailOpen(item)}
                  >
                    <InfoIcon color="primary" fontSize="medium" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleContact(item)}>
                    <PhoneIcon color="primary" fontSize="medium" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleLike(item.id)}>
                    <FavoriteBorderIcon
                      fontSize="small"
                      color={item.isLiked ? "primary" : "inherit"}
                    />
                    <Typography variant="caption" ml={0.3}>
                      {item.likeCount}
                    </Typography>
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      openComments(item);
                      setCommentOpen(true);
                    }}
                  >
                    {/* <FeedbackIcon /> */}
                    <QuestionAnswerIcon color="primary" />
                    {/* <CommentIcon fontSize="small" /> */}
                  </IconButton>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}

        {filteredItems.length === 0 && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
            Hech narsa topilmadi.
          </Typography>
        )}
      </Grid>
      <CommentDrawer
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
        onSubmit={(text) => handleCommentSubmit(text, selectedItem?.id)}
        currentItemId={selectedItem?.id}
        commentsData={commentsData}
        fetchComments={fetchComments}
      />
      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleDetailClose}>
        <DialogTitle>{selectedItem?.title}</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <>
              <Box
                component="img"
                src={selectedItem.image}
                alt={selectedItem.title}
                sx={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 1,
                  mb: 2,
                }}
              />
              <DialogContentText>{selectedItem.description}</DialogContentText>
              <DialogContentText sx={{ mt: 1 }}>
                <strong>Joy:</strong> {selectedItem.location}
              </DialogContentText>
              <DialogContentText>
                <strong>Sana:</strong> {selectedItem.dateLost}
              </DialogContentText>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailClose}>Yopish</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
