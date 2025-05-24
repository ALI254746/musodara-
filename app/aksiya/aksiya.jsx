"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  InputLabel,
  FormControl,
} from "@mui/material";

const promoData = [
  {
    title: "FoodExpress: 50% chegirma",
    code: "FOOD50",
    expires: "10-maygacha",
    category: "food",
    image: "/promo-food.jpg",
  },
  {
    title: "TaxiGo: 20k so‘m bonus",
    code: "TAXI20",
    expires: "8-maygacha",
    category: "taxi",
    image: "/promo-taxi.jpg",
  },
  {
    title: "Kitoblar.uz: Bepul yetkazib berish",
    code: "BOOKFREE",
    expires: "15-maygacha",
    category: "tech",
    image: "/promo-book.jpg",
  },
];

export default function PromoPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filteredPromos = promoData.filter(
    (promo) =>
      promo.title.toLowerCase().includes(search.toLowerCase()) &&
      (category === "all" || promo.category === category)
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Aksiyalar & Promokodlar
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <TextField
          label="Qidiruv..."
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FormControl>
          <InputLabel>Kategoriya</InputLabel>
          <Select
            value={category}
            label="Kategoriya"
            onChange={(e) => setCategory(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">Barchasi</MenuItem>
            <MenuItem value="food">Oziq-ovqat</MenuItem>
            <MenuItem value="taxi">Transport</MenuItem>
            <MenuItem value="tech">Texnika</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {filteredPromos.map((promo, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia
                component="img"
                height="160"
                image={promo.image}
                alt={promo.title}
              />
              <CardContent>
                <Typography variant="h6">{promo.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Amal qilish muddati: {promo.expires}
                </Typography>
                <Typography sx={{ mt: 1 }}>
                  <strong>Kod:</strong> {promo.code}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => navigator.clipboard.writeText(promo.code)}
                >
                  Kodni nusxalash
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
