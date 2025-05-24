"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
} from "@mui/material";

// Hero Section
const HeroSection = () => {
  return (
    <Box
      sx={{
        position: "relative",
        textAlign: "center",
        color: "#fff",
        backgroundImage: "url(./image2.jpg)", // O'zingizga mos rasmni qo'shing
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        marginBottom: 1,
      }}
    >
      <Container>
        <Typography variant="h3" sx={{ fontWeight: "bold", marginBottom: 0 }}>
          Xush kelibsiz! Biz bilan yangiliklarni kashf eting!
        </Typography>
        <Typography variant="h5" sx={{ marginBottom: 3 }}>
          Saytingizning maqsadi haqida qisqacha ma'lumot.
        </Typography>
      </Container>
    </Box>
  );
};

// Parallax Section
const ParallaxSection = () => {
  return (
    <Box sx={{ position: "relative", overflow: "hidden" }}>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url(./image2.jpg)", // O'zingizga mos rasmni qo'shing
          backgroundSize: "cover",
          zIndex: -1,
          filter: "brightness(0.5)",
          transform: "scale(1.2)",
        }}
      />
      <Container>
        <Typography
          variant="h4"
          sx={{ color: "#fff", padding: 4, textAlign: "center" }}
        >
          Bizning xizmatlarimiz bilan tanishing!
        </Typography>
      </Container>
    </Box>
  );
};

// Testimonials Section
const Testimonials = () => {
  const reviews = [
    { name: "Ali", review: "Ajoyib sayt! Ko‘p yordam berdi." },
    { name: "Olim", review: "Samarali va foydali resurs." },
    { name: "Gulbahor", review: "Shaxsiylashtirilgan xizmatlar juda yaxshi." },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" sx={{ marginBottom: 0, textAlign: "center" }}>
        Foydalanuvchilar Sharhlari
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {reviews.map((review, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {review.name}
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 1 }}>
                  {review.review}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Call To Action Section
const CallToAction = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#3f51b5",
        color: "#fff",
        padding: 4,
        textAlign: "center",
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Bizning imkoniyatlarimiz haqida ko‘proq bilib oling!
      </Typography>
      <Button variant="contained" color="secondary" size="large">
        Ma'lumot olish
      </Button>
    </Box>
  );
};

// Service Tabs Section
const ServiceTabs = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" sx={{ marginBottom: 2, textAlign: "center" }}>
        Bizning Xizmatlarimiz
      </Typography>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Xizmat 1" />
        <Tab label="Xizmat 2" />
        <Tab label="Xizmat 3" />
      </Tabs>
      <Box sx={{ padding: 3 }}>
        {value === 0 && (
          <Typography variant="body1">
            Xizmat 1 haqida batafsil ma'lumot.
          </Typography>
        )}
        {value === 1 && (
          <Typography variant="body1">
            Xizmat 2 haqida batafsil ma'lumot.
          </Typography>
        )}
        {value === 2 && (
          <Typography variant="body1">
            Xizmat 3 haqida batafsil ma'lumot.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

// Footer Section
const Footer = () => {
  return (
    <Box sx={{ backgroundColor: "#f5f5f5", padding: 4, textAlign: "center" }}>
      <Typography variant="h6">
        Saytimizdan foydalanganingiz uchun rahmat!
      </Typography>
      <Button variant="outlined" sx={{ marginTop: 2 }}>
        Bosh sahifaga qaytish
      </Button>
    </Box>
  );
};

// Main Page (Barcha bo'limlarni bitta sahifaga joylash)
const HomePage = () => {
  return (
    <>
      <HeroSection />
      <CallToAction />
      <Testimonials />
      <ParallaxSection />
      <ServiceTabs />
      <Footer />
    </>
  );
};

export default HomePage;
