import React, { useState } from "react";
import { Container, Card, CardContent, Typography, Button, Box, Grid } from "@mui/material";

const ListCinema: React.FC = () => {
    // State to track selected showtime
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    return (
        <Box sx={{ backgroundColor: "#0B0D1A", color: "white", minHeight: "50vh"}}>
            <Container maxWidth="md">
                {/* Title and Location Selection (Same Row) */}
                <Grid container alignItems="center" justifyContent="space-between" mb={3}>
                    <Grid item>
                        <Typography variant="h3" fontWeight="bold">
                            🎬 DANH SÁCH RẠP
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="outlined"
                            sx={{
                                borderColor: "yellow",
                                color: "yellow",
                                fontWeight: "bold",
                                fontSize: "16px",
                                borderRadius: "12px",
                                px: 3,
                                "&:hover": { backgroundColor: "yellow", color: "black" },
                            }}
                        >
                            📍 HỒ CHÍ MINH ▼
                        </Button>
                    </Grid>
                </Grid>

                {/* Cinema List (Below, Light Purple Background) */}
                <Box sx={{ borderRadius: "12px", p: 3 }}>
                    {[
                        {
                            name: "Eiga Quốc Thanh",
                            address: "271 Nguyễn Trãi, Phường Nguyễn Cư Trinh, Quận 1, TP. Hồ Chí Minh",
                            times: ["16:00", "17:10", "19:15", "21:20", "22:10", "23:30"],
                        },
                        {
                            name: "Eiga Hai Bà Trưng (TP.HCM)",
                            address: "135 Hai Bà Trưng, Quận 3, TP. Hồ Chí Minh",
                            times: ["15:30", "18:00", "20:45"],
                        },
                    ].map((cinema, index) => (
                        <Card key={index} sx={{ backgroundColor: "#7B3FA7", color: "white", borderRadius: "12px", p: 2, mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold" color="yellow">
                                    {cinema.name}
                                </Typography>
                                <Typography variant="body2" mb={2}>
                                    {cinema.address}
                                </Typography>
                                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                    {cinema.times.map((time, idx) => (
                                        <Button
                                            key={idx}
                                            variant="contained"
                                            sx={{
                                                backgroundColor: selectedTime === time ? "yellow" : "transparent",
                                                color: selectedTime === time ? "black" : "white",
                                                border: "1px solid white",
                                                fontWeight: "bold",
                                                "&:hover": {
                                                    backgroundColor: "yellow",
                                                    color: "black",
                                                },
                                            }}
                                            onClick={() => setSelectedTime(time)}
                                        >
                                            {time}
                                        </Button>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default ListCinema;
