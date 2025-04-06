import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { UserResponse } from "../../../types/users.type";
import { t } from "i18next";

interface XoaNhanVienProps {
  isDialogOpen: boolean;
  handleCloseDialog: () => void;
  handleConfirmDelete: () => void;
  employeeData: UserResponse | null;
}

const XoaNhanVien = ({
  isDialogOpen,
  handleCloseDialog,
  handleConfirmDelete,
  employeeData,
}: XoaNhanVienProps) => {
  if (!employeeData) return null;

  return (
    <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
      <DialogTitle>{t("admin.employee_managemet.delete.title")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t("admin.employee_managemet.delete.make_sure")} {employeeData.fullName}? {t("admin.employee_managemet.delete.cannot_change")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>{t("admin.employee_managemet.cancel")}</Button>
        <Button onClick={handleConfirmDelete} color="error" variant="contained">
          {t("admin.employee_managemet.delete.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default XoaNhanVien;
