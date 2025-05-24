// components/RegisterPage.jsx

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
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { keyframes } from "@mui/system";

// Fade-in slide-down animation for form
const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export default function RegisterPage() {
  const router = useRouter();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const name = data.get("name");
    const email = data.get("email");
    const password = data.get("password");
    const confirm = data.get("confirm");

    if (password !== confirm) {
      setError("Parol va tasdiqlash mos emas");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Ro‘yxatdan o‘tishda xatolik");
        setLoading(false);
        return;
      }
      router.push("/login");
    } catch (e) {
      setError("Tarmoqda muammo yuz berdi");
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #388e3c, #81c784)",
        p: 2,
      }}
    >
      <Grid
        container
        component={Paper}
        elevation={6}
        direction={isSmall ? "column-reverse" : "row"}
        sx={{
          width: isSmall ? "100%" : 900,
          borderRadius: 4,
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
            bgcolor: "#f1f8e9",
            p: { xs: 3, md: 6 },
            animation: `${slideIn} 0.8s ease-out`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
            Ro‘yxatdan o‘tish
          </Typography>

          <TextField
            name="name"
            label="Ism va Familiya"
            required
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            name="email"
            label="Email Manzil"
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
            label="Yangi Parol"
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

          <TextField
            name="confirm"
            label="Parolni Tasdiqlash"
            type={showConfirm ? "text" : "password"}
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
                  <IconButton onClick={() => setShowConfirm((s) => !s)}>
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
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
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              background: "linear-gradient(90deg, #00c853 0%, #69f0ae 100%)",
              fontWeight: "bold",
            }}
          >
            {loading ? "Yuklanmoqda…" : "Ro‘yxatdan o‘tish"}
          </Button>

          <Typography align="center" variant="body2">
            Allaqachon ro‘yxatdan o‘tganmisiz?{" "}
            <Link
              href="/login"
              style={{ fontWeight: "bold", color: "#388e3c" }}
            >
              Kirish sahifasiga o‘tish
            </Link>
          </Typography>
        </Grid>

        {/* Welcome Section */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            bgcolor: "#388e3c",
            color: "white",
            p: { xs: 3, md: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography
            variant={isSmall ? "h6" : "h4"}
            fontFamily="cursive"
            textTransform="uppercase"
            gutterBottom
          >
            Xush Kelibsiz!
          </Typography>
          <Typography variant="body1" mb={2}>
            Bizning jamoaga qo‘shiling va ariza joylang
          </Typography>
          <Button
            component={Link}
            href="/login"
            variant="outlined"
            sx={{ borderColor: "white", color: "white", py: 1.5, px: 4 }}
          >
            Kirish
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
