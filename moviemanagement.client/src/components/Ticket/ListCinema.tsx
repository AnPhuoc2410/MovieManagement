import React, { useState } from "react";
import { 
    Container, Card, CardContent, Typography, Button, 
    Box, Grid, MenuItem, FormControl, Select 
} from "@mui/material";

const ListCinema: React.FC = () => {
    // State to track selected showtime
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<string>("hcm");

    const handleCityChange = (event: any) => {
        setSelectedCity(event.target.value);
    };

    return (
        <Box sx={{ backgroundColor: "#0B0D1A", color: "white", minHeight: "50vh", py: 5 }}>
            <Container maxWidth="md">
                {/* Title and Location Selection (Same Row) */}
                <Grid container alignItems="center" justifyContent="space-between" mb={3}>
                    <Grid item>
                        <Typography variant="h3" fontWeight="bold">
                            🎬 DANH SÁCH RẠP
                        </Typography>
                    </Grid>
                    <Grid item>
                        <FormControl>
                            <Select
                                value={selectedCity}
                                onChange={handleCityChange}
                                displayEmpty
                                variant="outlined"
                            sx={{
                                borderColor: "yellow",
                                color: "black",
                                fontWeight: "bold",
                                fontSize: "16px",
                                borderRadius: "12px",
                                px: 3,
                                 backgroundColor: "yellow",
                            }}
                            >
                                <MenuItem value="hcm">📍 Hồ Chí Minh</MenuItem>
                                <MenuItem value="hn">📍 Hà Nội</MenuItem>
                                <MenuItem value="dn">📍 Đà Nẵng</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {/* Cinema List (Filtered by City) */}
                <Box sx={{ borderRadius: "12px"}}>
                    {selectedCity === "hcm" && (
                        <>
                            <CinemaCard 
                                name="Eiga Quốc Thanh"
                                address="271 Nguyễn Trãi, Phường Nguyễn Cư Trinh, Quận 1, TP. Hồ Chí Minh"
                                times={["16:00", "17:10", "19:15", "21:20", "22:10", "23:30"]}
                                selectedTime={selectedTime}
                                setSelectedTime={setSelectedTime}
                            />
                            <CinemaCard 
                                name="Eiga Hai Bà Trưng (TP.HCM)"
                                address="135 Hai Bà Trưng, Quận 3, TP. Hồ Chí Minh"
                                times={["15:30", "18:00", "20:45"]}
                                selectedTime={selectedTime}
                                setSelectedTime={setSelectedTime}
                            />
                        </>
                    )}
                    {selectedCity === "hn" && (
                        <CinemaCard 
                            name="Eiga Hà Nội"
                            address="42 Phố Huế, Quận Hoàn Kiếm, Hà Nội"
                            times={["14:00", "16:30", "19:00"]}
                            selectedTime={selectedTime}
                            setSelectedTime={setSelectedTime}
                        />
                    )}
                    {selectedCity === "dn" && (
                        <CinemaCard 
                            name="Eiga Đà Nẵng"
                            address="92 Nguyễn Văn Linh, Hải Châu, Đà Nẵng"
                            times={["13:00", "15:45", "18:30"]}
                            selectedTime={selectedTime}
                            setSelectedTime={setSelectedTime}
                        />
                    )}
                </Box>
            </Container>
        </Box>
    );
};

// Cinema Card Component for reusability
const CinemaCard: React.FC<{ 
    name: string, 
    address: string, 
    times: string[], 
    selectedTime: string | null, 
    setSelectedTime: React.Dispatch<React.SetStateAction<string | null>> 
}> = ({ name, address, times, selectedTime, setSelectedTime }) => {
    return (
        <Card sx={{ backgroundColor: "#7B3FA7", color: "white", borderRadius: "12px", p: 2, mb: 2 }}>
            <CardContent>
                <Typography variant="h6" fontWeight="bold" color="yellow">
                    {name}
                </Typography>
                <Typography variant="body2" mb={2}>
                    {address}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {times.map((time, idx) => (
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
    );
};

export default ListCinema;
