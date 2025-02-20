import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, Controller } from "react-hook-form";

interface Promotion {
  id: number;
  title: string;
  discount: number;
  startDate: string;
  endDate: string;
}

const initialPromotions: Promotion[] = [
  { id: 1, title: "Black Friday", discount: 30, startDate: "2025-11-25", endDate: "2025-11-30" },
  { id: 2, title: "New Year Sale", discount: 20, startDate: "2025-12-31", endDate: "2026-01-05" },
];

export default function Promotions() {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [open, setOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);

  const { control, handleSubmit, reset } = useForm<Promotion>({
    defaultValues: { id: 0, title: "", discount: 0, startDate: "", endDate: "" },
  });

  const handleOpen = (promotion?: Promotion) => {
    setSelectedPromotion(promotion || null);
    reset(promotion || { id: 0, title: "", discount: 0, startDate: "", endDate: "" });
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Promotions Management
      </Typography>

      <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
        Add Promotion
      </Button>

      <Box sx={{ height: 400, mt: 2 }}>
        <DataGrid rows={promotions} columns={columns} pageSizeOptions={[5]} />
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
              render={({ field }) => <TextField {...field} fullWidth label="Start Date" type="date" margin="dense" />}
            />
            <Controller
              name="endDate"
              control={control}
              rules={{ required: "End date is required" }}
              render={({ field }) => <TextField {...field} fullWidth label="End Date" type="date" margin="dense" />}
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
  );
}
