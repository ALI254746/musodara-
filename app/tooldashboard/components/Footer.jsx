"use client";
import { Box, Container, Typography, Button, Stack } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: "#f5f5f5", py: 4, mt: 5 }}>
      <Container maxWidth="md">
        <Stack spacing={2} alignItems="center">
          <Typography variant="h6" color="text.primary">
            © 2025 MyWebsite. Barcha huquqlar himoyalangan.
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Biz bilan bog'laning: info@mywebsite.com
          </Typography>
          <Button variant="contained" color="primary" size="small">
            Bosh sahifaga qaytish
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
