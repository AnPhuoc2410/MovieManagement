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

// Theme & Customizations
import AppTheme from "../../shared-theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "../../theme/customizations";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

interface Promotion {
  id: number;
  title: string;
  discount: number;
  startDate: string;
  endDate: string;
  detail: string;
}

const initialPromotions: Promotion[] = [
  {
    id: 1,
    title: "Black Friday",
    discount: 30,
    startDate: "2025-11-25",
    endDate: "2025-11-30",
    detail: "Discount 30% for all products",
  },
  {
    id: 2,
    title: "New Year Sale",
    discount: 20,
    startDate: "2025-12-31",
    endDate: "2026-01-05",
    detail: "Discount 20% for all products",
  },
];

export default function Promotions({ disableCustomTheme = false }: { disableCustomTheme?: boolean }) {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [open, setOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);

  const { control, handleSubmit, reset } = useForm<Promotion>({
    defaultValues: { id: 0, title: "", discount: 0, startDate: "", endDate: "", detail: "" },
  });

  const handleOpen = (promotion?: Promotion) => {
    setSelectedPromotion(promotion || null);
    reset(promotion || { id: 0, title: "", discount: 0, startDate: "", endDate: "", detail: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPromotion(null);
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
    <AppTheme disableCustomTheme={disableCustomTheme} themeComponents={xThemeComponents}>
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
                  <TextField
                    {...field}
                    fullWidth
                    label="Start Date"
                    type="date"
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
              <Controller
                name="endDate"
                control={control}
                rules={{ required: "End date is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="End Date"
                    type="date"
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
              <Controller
                name="detail"
                control={control}
                rules={{ required: "Detail is required" }}
                render={({ field }) => <TextField {...field} fullWidth label="Detail" margin="dense" />}
              />
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
