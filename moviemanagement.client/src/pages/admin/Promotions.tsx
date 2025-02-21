import * as React from "react";
import { useState } from "react";
import {
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Stack,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, Controller } from "react-hook-form";
import { alpha } from "@mui/material/styles";

// Layout Components
import AppNavbar from "../../components/mui/AppNavbar";
import Header from "../../components/mui/Header";
import SideMenu from "../../components/mui/SideMenu";

// Import Cloudinary Upload Widget & CloudinaryImage components
import CloudinaryUploadWidget from "../../components/cloudinary/CloudinaryUploadWidget";
import CloudinaryImage from "../../components/cloudinary/CloudinaryImage";

// Theme & Customizations
import AppTheme from "../../shared-theme/AppTheme";

interface Promotion {
  id: number;
  title: string;
  discount: number;
  startDate: string;
  endDate: string;
  detail: string;
  image?: string;
}

const initialPromotions: Promotion[] = [
  {
    id: 1,
    title: "Black Friday",
    discount: 30,
    startDate: "2025-11-25",
    endDate: "2025-11-30",
    detail: "Discount 30% for all products",
    image: "https://res.cloudinary.com/dwqyqsqmq/image/upload/v1740121129/samples/chair.png",
  },
  {
    id: 2,
    title: "New Year Sale",
    discount: 20,
    startDate: "2025-12-31",
    endDate: "2026-01-05",
    detail: "Discount 20% for all products",
    image: "https://res.cloudinary.com/dwqyqsqmq/image/upload/v1740121129/samples/coffee.jpg",
  },
];

export default function Promotions({ disableCustomTheme = false }: { disableCustomTheme?: boolean }) {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [open, setOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  // For image preview from Cloudinary
  const [uploadedImage, setUploadedImage] = useState<string>("");

  const { control, handleSubmit, reset, setValue } = useForm<Promotion>({
    defaultValues: { id: 0, title: "", discount: 0, startDate: "", endDate: "", detail: "", image: "" },
  });

  // Cloudinary widget configuration
  const uwConfig = {
    cloudName: "dwqyqsqmq", 
    uploadPreset: "movie_up",
  };

  // When an image is uploaded, build the secure URL and update the form
  const handleSetPublicId = (publicId: string) => {
    const imageUrl = `https://res.cloudinary.com/dwqyqsqmq/image/upload/${publicId}`;
    setUploadedImage(imageUrl);
    setValue("image", imageUrl);
  };

  const handleOpen = (promotion?: Promotion) => {
    setSelectedPromotion(promotion || null);
    reset(promotion || { id: 0, title: "", discount: 0, startDate: "", endDate: "", detail: "", image: "" });
    setUploadedImage(promotion?.image || "");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPromotion(null);
    setUploadedImage("");
  };

  const onSubmit = (data: Promotion) => {
    if (selectedPromotion) {
      setPromotions(promotions.map((p) => (p.id === data.id ? data : p)));
    } else {
      setPromotions([...promotions, { ...data, id: promotions.length + 1 }]);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    setPromotions(promotions.filter((p) => p.id !== id));
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "discount", headerName: "Discount (%)", width: 130 },
    { field: "startDate", headerName: "Start Date", width: 150 },
    { field: "endDate", headerName: "End Date", width: 150 },
    { field: "detail", headerName: "Detail", flex: 1 },
    {
      field: "image",
      headerName: "Image",
      width: 120,
      renderCell: (params) =>
        params.row.image ? (
          <CloudinaryImage imageUrl={params.row.image} />
        ) : (
          "No image"
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleOpen(params.row)}>
            <EditIcon color="primary" />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon color="error" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <AppTheme disableCustomTheme={disableCustomTheme}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* Sidebar */}
        <SideMenu />

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {/* Top Navigation Bar */}
          <AppNavbar />

          {/* Page Content */}
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: alpha(theme.palette.background.default, 1),
              overflowY: "auto",
              px: 3,
              py: 2,
            })}
          >
            <Stack spacing={2} alignItems="center">
              <Header />
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ mb: 2 }}>
                Add Promotion
              </Button>

              {/* Promotions Table */}
              <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid rows={promotions} columns={columns} pageSizeOptions={[5, 10, 20]} />
              </Box>
            </Stack>
          </Box>
        </Box>

        {/* Add/Edit Promotion Dialog */}
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle>{selectedPromotion ? "Edit Promotion" : "Add Promotion"}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => <TextField {...field} fullWidth label="Title" margin="dense" />}
              />
              <Controller
                name="discount"
                control={control}
                rules={{ required: "Discount is required", min: 1, max: 100 }}
                render={({ field }) => <TextField {...field} fullWidth label="Discount (%)" type="number" margin="dense" />}
              />
              <Controller
                name="startDate"
                control={control}
                rules={{ required: "Start date is required" }}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="Start Date" type="date" margin="dense" InputLabelProps={{ shrink: true }} />
                )}
              />
              <Controller
                name="endDate"
                control={control}
                rules={{ required: "End date is required" }}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="End Date" type="date" margin="dense" InputLabelProps={{ shrink: true }} />
                )}
              />
              <Controller
                name="detail"
                control={control}
                rules={{ required: "Detail is required" }}
                render={({ field }) => <TextField {...field} fullWidth label="Detail" margin="dense" />}
              />

              {/* Cloudinary Upload Section */}
              <Box sx={{ my: 2 }}>
                <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={handleSetPublicId} />
                {uploadedImage && (
                  <Box sx={{ mt: 1 }}>
                    <CloudinaryImage imageUrl={uploadedImage} />
                  </Box>
                )}
              </Box>
              <DialogActions>
                <Button onClick={handleClose} color="secondary">
                  Cancel
                </Button>
                <Button type="submit" variant="contained">
                  {selectedPromotion ? "Update" : "Add"}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </Box>
    </AppTheme>
  );
}
