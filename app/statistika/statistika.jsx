"use client";
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  ButtonGroup,
  Button,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

// Chart.js komponentlarini ro'yxatdan o'tkazamiz
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Ma'lumotlar
const itemData = {
  lostItems: [120, 100, 90], // Yo'qotilgan buyumlar
  lostLocations: [80, 70, 60], // Yo'qotilayotgan joylar
  charityItems: [50, 40, 30], // Xayriya qilingan buyumlar
};

const labels = ["Phone", "Bag", "Passport"];

const chartData = {
  lostItemsData: {
    labels: labels,
    datasets: [
      {
        label: "Yo'qotilgan buyumlar",
        data: itemData.lostItems,
        backgroundColor: "rgba(25, 118, 210, 0.6)",
        borderRadius: 5,
      },
    ],
  },

  lostLocationsData: {
    labels: ["Toshkent", "Andijon", "Namangan"],
    datasets: [
      {
        label: "Yo'qotilayotgan joylar",
        data: itemData.lostLocations,
        backgroundColor: "rgba(255, 87, 34, 0.6)",
        borderRadius: 5,
      },
    ],
  },

  charityItemsData: {
    labels: ["Clothes", "Books", "Toys"],
    datasets: [
      {
        label: "Xayriya qilingan buyumlar",
        data: itemData.charityItems,
        backgroundColor: "rgba(46, 125, 50, 0.6)",
        borderRadius: 5,
      },
    ],
  },
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    tooltip: {
      enabled: true,
    },
  },
  animation: {
    duration: 1500,
    easing: "easeOutBounce",
  },
};

export default function Statistikalar() {
  const [selectedOption, setSelectedOption] = React.useState("lostItems"); // Default: yo'qotilgan buyumlar
  const [timeFilter, setTimeFilter] = React.useState("today"); // Default: bugungi

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleTimeFilterChange = (filter) => {
    setTimeFilter(filter);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        gap: 4,
        padding: 4,
      }}
    >
      {/* Radio Button tanlovi */}
      <FormControl component="fieldset">
        <RadioGroup value={selectedOption} onChange={handleOptionChange} row>
          <FormControlLabel
            value="lostItems"
            control={<Radio />}
            label="Eng ko'p yo'qotilgan buyumlar"
          />
          <FormControlLabel
            value="lostLocations"
            control={<Radio />}
            label="Eng ko'p yo'qotilyotgan joylar"
          />
          <FormControlLabel
            value="charityItems"
            control={<Radio />}
            label="Eng ko'p xayriya qilinyotgan buyumlar"
          />
        </RadioGroup>
      </FormControl>

      {/* Vaqt filtri tugmalari */}
      <ButtonGroup
        variant="outlined"
        color="primary"
        aria-label="Time filter"
        sx={{ alignSelf: "center" }}
      >
        <Button
          variant={timeFilter === "today" ? "contained" : "outlined"}
          onClick={() => handleTimeFilterChange("today")}
        >
          Bugun
        </Button>
        <Button
          variant={timeFilter === "week" ? "contained" : "outlined"}
          onClick={() => handleTimeFilterChange("week")}
        >
          Hafta
        </Button>
        <Button
          variant={timeFilter === "month" ? "contained" : "outlined"}
          onClick={() => handleTimeFilterChange("month")}
        >
          Oy
        </Button>
        <Button
          variant={timeFilter === "year" ? "contained" : "outlined"}
          onClick={() => handleTimeFilterChange("year")}
        >
          Yil
        </Button>
      </ButtonGroup>

      {/* Grafiklar */}
      <Card
        elevation={2}
        sx={{
          maxWidth: "100%",
          width: { xs: "100%", sm: "80%", md: "60%" },
          margin: "auto",
        }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">
            {selectedOption === "lostItems" &&
              "Yo'qotilgan Buyumlar Statistikasi"}
            {selectedOption === "lostLocations" &&
              "Yo'qotilayotgan Joylar Statistikasi"}
            {selectedOption === "charityItems" &&
              "Xayriya Qilingan Buyumlar Statistikasi"}
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 2 }}>
            {timeFilter === "today" && "Bugungi natijalar"}
            {timeFilter === "week" && "Haftalik natijalar"}
            {timeFilter === "month" && "Oylik natijalar"}
            {timeFilter === "year" && "Yillik natijalar"}
          </Typography>
          <Bar
            data={
              selectedOption === "lostItems"
                ? chartData.lostItemsData
                : selectedOption === "lostLocations"
                ? chartData.lostLocationsData
                : chartData.charityItemsData
            }
            options={options}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
