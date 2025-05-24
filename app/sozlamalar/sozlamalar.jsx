// settings/page.jsx (Next.js + MUI)

"use client";

import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  FormGroup,
  Slider,
  Tabs,
  Tab,
} from "@mui/material";
import { useState } from "react";

export default function SettingsPage() {
  const [profilePic, setProfilePic] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [bio, setBio] = useState("Men yordam berishni yaxshi ko‘raman.");
  const [radius, setRadius] = useState(5);
  const [tabIndex, setTabIndex] = useState(0);
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("avatar", selectedFile); // Bio qo‘shiladi
    console.log("bio:", bio);
    console.log("file:", selectedFile);

    const res = await fetch("/api/user", {
      method: "PATCH",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      alert("Profil yangilandi!");
    } else {
      alert("Xatolik: " + data.error);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 600, mx: "auto" }}>
      <Typography
        variant="h5"
        gutterBottom
        textAlign={{ xs: "center", sm: "left" }}
      >
        Sozlamalar
      </Typography>

      <Tabs
        value={tabIndex}
        onChange={(_, i) => setTabIndex(i)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2 }}
      >
        <Tab label="Profil" />
        <Tab label="Maxfiylik" />
        <Tab label="Bildirishnoma" />
        <Tab label="Joylashuv" />
      </Tabs>

      {tabIndex === 0 && (
        <Box>
          <Typography variant="h6" mt={2}>
            Profil ma'lumotlari
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Avatar src={profilePic} sx={{ width: 80, height: 80, mb: 1 }} />
            <Button variant="outlined" component="label" size="small">
              Rasm yuklash
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setProfilePic(URL.createObjectURL(file));
                    setSelectedFile(file); // <-- BU QO‘SHILDI
                  }
                }}
              />
            </Button>
          </Box>

          <TextField
            fullWidth
            label="Men haqimda (bio)"
            value={bio}
            multiline
            rows={2}
            onChange={(e) => setBio(e.target.value)}
          />
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleSave}>
            Saqlash
          </Button>
        </Box>
      )}

      {tabIndex === 1 && (
        <Box>
          <Typography variant="h6" mt={2}>
            Maxfiylik
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Do‘stlarimga arizalarimni ko‘rsatish"
            />
            <FormControlLabel
              control={<Switch />}
              label="Profilimni faqat do‘stlar ko‘rsin"
            />
          </FormGroup>
        </Box>
      )}

      {tabIndex === 2 && (
        <Box>
          <Typography variant="h6" mt={2}>
            Bildirishnomalar
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Yaqin arizalar haqida ogohlantirish"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Do‘stlik so‘rovlari haqida xabar"
            />
            <FormControlLabel
              control={<Switch />}
              label="Arizamga baho qo‘yilganda ogohlantirilsin"
            />
          </FormGroup>
        </Box>
      )}

      {tabIndex === 3 && (
        <Box>
          <Typography variant="h6" mt={2}>
            Joylashuv radiusi (km)
          </Typography>
          <Slider
            value={radius}
            onChange={(_, v) => setRadius(v)}
            step={1}
            min={1}
            max={20}
            valueLabelDisplay="on"
          />
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography
        variant="caption"
        color="text.secondary"
        textAlign="center"
        display="block"
      >
        Lost or Found — foydalanuvchilar uchun shaxsiylashtirilgan tajriba.
      </Typography>
    </Box>
  );
}
