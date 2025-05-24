// components/LoginPage.jsx

"use client";

import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.status === 404) {
      router.push("/register");
      return;
    }
    if (!res.ok) {
      setError("Login davomida xatolik yuz berdi");
      return;
    }
    router.push("/mainpage");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #512B2B, #C9A27E)",
        p: 2,
      }}
    >
      <Grid
        container
        component={Paper}
        elevation={6}
        direction={isSmall ? "column" : "row"}
        sx={{
          width: isSmall ? "100%" : 900,
          height: isSmall ? "auto" : 600,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* Form Section */}
        <Grid
          item
          xs={12}
          md={6}
          component="form"
          onSubmit={handleSubmit}
          sx={{
            bgcolor: "#F5EBDD",
            p: { xs: 3, md: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
            Kirish
          </Typography>
          <TextField
            name="email"
            label="Email manzil"
            type="email"
            required
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            name="password"
            label="Parol"
            type={showPassword ? "text" : "password"}
            required
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((s) => !s)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {error && (
            <Typography color="error" variant="body2" mt={1}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, backgroundColor: "#C9A27E", color: "#000", py: 1.5 }}
          >
            Kirish
          </Button>
          <Typography align="center" variant="body2" mt={2}>
            Ro‘yxatdan o‘tmaganmisiz?{" "}
            <Link
              href="/register"
              style={{ fontWeight: "bold", color: "#512B2B" }}
            >
              Ro‘yxatdan o‘tish
            </Link>
          </Typography>
        </Grid>

        {/* Welcome Section */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            bgcolor: "#512B2B",
            color: "white",
            p: { xs: 3, md: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              bgcolor: "#7c4a2d",
              px: 3,
              py: 2,
              borderRadius: 2,
              mb: 2,
            }}
          >
            <Typography
              variant={isSmall ? "h6" : "h4"}
              fontFamily="cursive"
              textTransform="uppercase"
            >
              Welcome!
            </Typography>
          </Box>
          <Typography variant="body1" mb={2}>
            Hali hisobingiz yo‘qmi?
          </Typography>
          <Button
            component={Link}
            href="/register"
            variant="outlined"
            sx={{ borderColor: "white", color: "white", py: 1.5, px: 4 }}
          >
            Ro‘yxatdan o‘tish
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
