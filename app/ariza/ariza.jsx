// app/ariza/page.jsx
"use client";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import submitAriza from "@/lib/submitariza";
import {
  Container,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SnackbarProvider, useSnackbar } from "notistack";
import React, { useState } from "react";

const steps = ["Shaxsiy Ma'lumotlar", "Buyum Ma'lumotlari", "Rasm yuklash"];

function LostFoundStepperForm() {
  const { enqueueSnackbar } = useSnackbar();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      phone: "",
      email: "",
      itemType: "",
      itemDescription: "",
      date: "",
      status: "topildi",
      location: "",
      image: null,
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Ism majburiy"),
      phone: Yup.string().required("Telefon raqam majburiy"),
      itemType: Yup.string().required("Buyum turi majburiy"),
      itemDescription: Yup.string().required("Buyum haqida ma'lumot majburiy"),
      date: Yup.string().required("Sana majburiy"),
      status: Yup.string().required("Topildi yoki Yo'qoldi tanlanishi kerak"),
      location: Yup.string().required("Joy majburiy"),
      region: Yup.string().required("Viloyat majburiy"), // ✅ Yangi
      district: Yup.string().required("Tuman majburiy"),
      image: Yup.mixed().required("Rasm majburiy"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const response = await submitAriza(values);

        if (response.ok) {
          enqueueSnackbar("Ariza muvaffaqiyatli yuborildi!", {
            variant: "success",
          });
          resetForm();
          setActiveStep(0);
          setSelectedImage(null);
        } else {
          enqueueSnackbar("Xatolik yuz berdi!", { variant: "error" });
        }
      } catch (error) {
        console.error("❌ API yuborishda xatolik:", error);
        enqueueSnackbar("Xatolik yuz berdi!", { variant: "error" });
      }
      setLoading(false);
    },
  });

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      formik.handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleImageChange = (e) => {
    const file = e.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("image", file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };
  const regions = {
    Toshkent: ["Yunusobod", "Chilonzor", "Mirzo Ulug'bek", "Yakkasaroy"],
    Samarqand: ["Urgut", "Kattaqo'rg'on", "Bulung'ur"],
    "Farg‘ona": ["Oltiariq", "Qo‘qon", "Marg‘ilon"],
    Andijon: ["Asaka", "Shahrixon", "Andijon shahri"],
    Buxoro: ["G‘ijduvon", "Vobkent", "Buxoro shahri"],
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Topilgan yoki Yo'qolgan yoki Xadiya Buyum Arizasi
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 4, mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box>
        {activeStep === 0 && (
          <>
            <TextField
              fullWidth
              label="Ismingiz"
              name="fullName"
              margin="normal"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
            />
            <TextField
              fullWidth
              label="Telefon raqamingiz"
              name="phone"
              margin="normal"
              value={formik.values.phone}
              onChange={formik.handleChange}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />
            <TextField
              fullWidth
              label="Email (ixtiyoriy)"
              name="email"
              margin="normal"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="region-label">Viloyat</InputLabel>
              <Select
                labelId="region-label"
                name="region"
                value={formik.values.region || ""}
                onChange={(e) => {
                  const selectedRegion = e.target.value;
                  formik.setFieldValue("region", selectedRegion);
                  formik.setFieldValue("district", ""); // eski tuman qiymatini tozalaymiz
                }}
                error={formik.touched.region && Boolean(formik.errors.region)}
              >
                {Object.keys(regions).map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              margin="normal"
              disabled={!formik.values.region}
            >
              <InputLabel id="district-label">Tuman</InputLabel>
              <Select
                labelId="district-label"
                name="district"
                value={formik.values.district || ""}
                onChange={formik.handleChange}
                error={
                  formik.touched.district && Boolean(formik.errors.district)
                }
              >
                {formik.values.region &&
                  regions[formik.values.region].map((district) => (
                    <MenuItem key={district} value={district}>
                      {district}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </>
        )}

        {activeStep === 1 && (
          <>
            <FormControl
              fullWidth
              error={formik.touched.itemType && Boolean(formik.errors.itemType)}
            >
              <InputLabel id="buyum-turi-label">Buyum turi</InputLabel>
              <Select
                fullWidth
                label="Buyum turi"
                name="itemType"
                margin="normal"
                value={formik.values.itemType}
                onChange={formik.handleChange}
              >
                <MenuItem value="Telefon">Telefon</MenuItem>
                <MenuItem value="Noutbuk">Noutbuk</MenuItem>
                <MenuItem value="Pasport">Pasport</MenuItem>
                <MenuItem value="Sumka">Sumka</MenuItem>
                <MenuItem value="Kalit">Kalit</MenuItem>
                <MenuItem value="Boshqa">Plastik Karta</MenuItem>
                <MenuItem value="Boshqa">Boshqa</MenuItem>
              </Select>
              {formik.touched.itemType && formik.errors.itemType && (
                <FormHelperText>{formik.errors.itemType}</FormHelperText>
              )}
            </FormControl>

            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Buyum haqida batafsil ma'lumot"
              name="itemDescription"
              margin="normal"
              value={formik.values.itemDescription}
              onChange={formik.handleChange}
              error={
                formik.touched.itemDescription &&
                Boolean(formik.errors.itemDescription)
              }
              helperText={
                formik.touched.itemDescription && formik.errors.itemDescription
              }
            />
            <TextField
              fullWidth
              type="date"
              name="date"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={formik.values.date}
              onChange={formik.handleChange}
              error={formik.touched.date && Boolean(formik.errors.date)}
              helperText={formik.touched.date && formik.errors.date}
            />
            <Box sx={{ mt: 2 }}>
              <FormLabel>Buyum holati</FormLabel>
              <RadioGroup
                row
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
              >
                <FormControlLabel
                  value="topildi"
                  control={<Radio />}
                  label="Topildi"
                />
                <FormControlLabel
                  value="yoqoldi"
                  control={<Radio />}
                  label="Yo'qoldi"
                />
                <FormControlLabel
                  value="Xadiya"
                  control={<Radio />}
                  label="Xadiya qilish"
                />
              </RadioGroup>
            </Box>
            <TextField
              fullWidth
              label="Topilgan yoki yo'qotilgan joy"
              name="location"
              margin="normal"
              value={formik.values.location}
              onChange={formik.handleChange}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
            />
          </>
        )}

        {activeStep === 2 && (
          <>
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ mt: 2 }}
            >
              Rasm yuklash
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
            {selectedImage && (
              <Box mt={2}>
                <img
                  src={selectedImage}
                  alt="Yuklangan rasm"
                  style={{
                    width: "100%",
                    maxHeight: 300,
                    objectFit: "contain",
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Orqaga
        </Button>
        <LoadingButton
          variant="contained"
          onClick={handleNext}
          loading={loading}
        >
          {activeStep === steps.length - 1 ? "Yuborish" : "Keyingi"}
        </LoadingButton>
      </Box>
    </Container>
  );
}

export default function LostFoundPage() {
  return (
    <SnackbarProvider maxSnack={3}>
      <LostFoundStepperForm />
    </SnackbarProvider>
  );
}
