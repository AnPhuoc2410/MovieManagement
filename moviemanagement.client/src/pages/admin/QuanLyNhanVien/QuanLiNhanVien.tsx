import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid-pro/themeAugmentation";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import { useQuery } from "react-query";
import { fetchNhanVien, fetchThanhVien } from "../../../apis/mock.apis";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ManagementPageLayout from "../../../layouts/ManagementPageLayout";
import EmployeeTable, { Employee } from "./BangNhanVien";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  DialogContentText,
} from "@mui/material";
import { useState } from "react";

const QuanLiNhanVien: React.FC = () => {
  const {
    data: danhSachNhanVien = [],
    isLoading,
    error,
  } = useQuery<Employee[]>(
    "NhanVienData", // Cache key
    fetchNhanVien,
  );

  // Add new state variables
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
  });

  // Add new state for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  const formFields: FormFieldConfig[] = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone", type: "text", required: true },
    { name: "position", label: "Position", type: "text", required: true },
  ];

  const handleAdd = () => {
    setDialogMode("add");
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
    });
    setOpenDialog(true);
  };

  const handleEdit = (id: string) => {
    const employeeToEdit = danhSachNhanVien.find((emp) => emp.id === id);
    if (employeeToEdit) {
      setDialogMode("edit");
      setSelectedEmployee(employeeToEdit);
      setFormData({
        name: employeeToEdit.name,
        email: employeeToEdit.email,
        phone: employeeToEdit.phone,
        position: employeeToEdit.position,
      });
      setOpenDialog(true);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedEmployee(null);
  };

  const handleSubmit = () => {
    if (dialogMode === "add") {
      // Add logic here
      console.log("Adding new employee:", formData);
    } else {
      // Edit logic here
      console.log("Editing employee:", selectedEmployee?.id, formData);
    }
    handleClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update handleDelete to show confirmation first
  const handleDelete = (id: string) => {
    setEmployeeToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Add confirmation handlers
  const handleConfirmDelete = () => {
    if (employeeToDelete) {
      // Actual delete logic here
      console.log("Confirmed deletion of employee:", employeeToDelete);
    }
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Failed to fetch data</div>;

  return (
    <>
      <Button variant="contained" onClick={handleAdd}>
        Add Nhan Vien
      </Button>
      <ManagementPageLayout
        children={
          <EmployeeTable
            employees={danhSachNhanVien}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        }
      />
      <GenericEditDialog
        open={openDialog}
        title={dialogMode === "add" ? "Add New Employee" : "Edit Employee"}
        formData={formData}
        fields={formFields}
        handleInputChange={handleInputChange}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        submitLabel={dialogMode === "add" ? "Add" : "Save Changes"}
      />

      {/* Add Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this employee? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

interface FormFieldConfig {
  name: string; // Name of the field (key in formData)
  label: string; // Label to be displayed
  type: string; // Type of the input (text, email, etc.)
  required?: boolean; // Optional: Whether the field is required
}

interface GenericDialogProps {
  open: boolean;
  title: string;
  formData: { [key: string]: any }; // Generic object to hold form data
  fields: FormFieldConfig[]; // Array of form fields configuration
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClose: () => void;
  handleSubmit: () => void;
  submitLabel?: string; // Label for submit button (e.g., "Add", "Save")
}

const GenericEditDialog: React.FC<GenericDialogProps> = ({
  open,
  title,
  formData,
  fields,
  handleInputChange,
  handleClose,
  handleSubmit,
  submitLabel = "Submit", // Default label for submit button
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {fields.map((field) => (
          <TextField
            key={field.name}
            autoFocus={field.name === fields[0].name} // Autofocus on the first field
            margin="dense"
            name={field.name}
            label={field.label}
            type={field.type}
            fullWidth
            required={field.required}
            value={formData[field.name] || ""} // Get value from formData using the field name
            onChange={handleInputChange}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuanLiNhanVien;
