//component//myariza.jsx
"use client";

import React, { useEffect, useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

export default function LostItemsPage() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // 🔁 API'dan ma'lumotni olish
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/myariza", {
          method: "GET",
          credentials: "include", // MUHIM!
        });
        const data = await res.json();
        console.log("Kelgan data:", data);
        const mappedData = data.applications.map((item) => ({
          id: item._id,
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Yo'qolgan buyumlar
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
      <Grid container spacing={4} justifyContent="center">
        {filteredItems.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: 6,
                },
                width: "100%",
                maxWidth: 345,
              }}
            >
              <CardMedia
                component="img"
                image={item.image}
                alt={item.title}
                height="200"
                sx={{ objectFit: "cover" }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6">
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  mb={1}
                  noWrap
                >
                  {item.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                  <strong>Joy:</strong> {item.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Sana:</strong> {item.dateLost}
                </Typography>
              </CardContent>

              <Box sx={{ p: 2, display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleDetailOpen(item)}
                >
                  Batafsil
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => handleContact(item)}
                >
                  Bog‘lanish
                </Button>
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
