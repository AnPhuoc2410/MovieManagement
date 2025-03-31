import React from "react";
import {
  Avatar,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { UserResponse } from "../../types/users.type";
import Loader from "./Loading";
import { useTranslation } from "react-i18next";

// Base interface for table data with string id
export interface TableData {
  userId?: string;
  MaNhanVien?: string;
  movieId?: string;
  roomId?: string;
  showTimeId?: string;
  [key: string]: any;
}

// Interface for column definition
export interface ColumnDef<T extends TableData> {
  field: keyof T;
  headerName: string;
  translationKey?: string; // Add this for translation
  align?: "left" | "center" | "right";
  width?: string | number;
  renderCell?: (item: T) => React.ReactNode;
}

// Props interface for the management table
interface ManagementTableProps<T extends TableData> {
  data?: T[];
  columns: ColumnDef<T>[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
  isLoading?: boolean;
  rowHeight?: number; // Add this new prop for row height
  actionColumn?: {
    align?: "left" | "center" | "right";
    width?: string | number;
    headerName?: string;
    translationKey?: string;
    backgroundColor?: string;
  };
}

// Default user columns that can be reused - now with translation keys
export const defaultUserColumns: ColumnDef<UserResponse>[] = [
  {
    field: "userName",
    headerName: "Username",
    translationKey: "common.table_header.user.username",
    align: "left",
    width: "200px",
    renderCell: (item) => (
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Avatar
          src={item.avatar || "/default-avatar.png"}
          alt={item.fullName}
        />
        <span>{item.userName}</span>
      </div>
    ),
  },
  {
    field: "fullName",
    headerName: "Full Name",
    translationKey: "common.table_header.user.fullname",
    align: "left",
  },
  {
    field: "email",
    headerName: "Email",
    translationKey: "common.table_header.user.email",
    align: "left",
  },
  {
    field: "phoneNumber",
    headerName: "Phone",
    translationKey: "common.table_header.user.phone",
    align: "left",
  },
  {
    field: "status",
    headerName: "Status",
    translationKey: "common.table_header.user.status",
    align: "center",
    renderCell: (item) => (
      <Chip
        label={item.status === 1 ? "Active" : "Inactive"}
        sx={{
          backgroundColor: item.status === 1 ? "#4caf50" : "#f44336",
          color: "white",
          fontWeight: "bold",
          borderRadius: "16px",
          padding: "0 8px",
          minWidth: "80px",
          minHeight: "32px",
          textAlign: "center",
        }}
      />
    ),
  },
];

function ManagementTable<T extends TableData>({
  data = [],
  columns,
  onEdit,
  onDelete,
  showActions = true,
  isLoading = false,
  rowHeight = 53, // Default row height (MUI default is ~53px)
  actionColumn = {
    align: "center",
    headerName: "Actions",
    translationKey: "common.table_header.actions", // Add default translation key
    width: "120px",
  },
}: ManagementTableProps<T>) {
  // Import translation hook here so it's available inside the component
  // Note: This import should be at the top level in actual implementation
  // but is shown here within the component for demonstration
  const { t } = useTranslation();

  if (isLoading) return <Loader />;

  const renderHeaderCells = () => {
    const headerCells = columns.map((column) => (
      <TableCell
        key={String(column.field)}
        align={column.align}
        style={{ width: column.width }}
        sx={{
          fontWeight: "bold",
        }}
      >
        {/* Use translation if available, otherwise use headerName */}
        {column.translationKey ? t(column.translationKey) : column.headerName}
      </TableCell>
    ));

    if (showActions) {
      headerCells.push(
        <TableCell
          key="actions"
          align={actionColumn.align}
          style={{ width: actionColumn.width }}
          sx={{
            fontWeight: "bold",
          }}
        >
          {/* Use translation if available, otherwise use headerName */}
          {actionColumn.translationKey
            ? t(actionColumn.translationKey)
            : actionColumn.headerName}
        </TableCell>,
      );
    }

    return headerCells;
  };

  const renderActionButtons = (item: T) => (
    <TableCell
      sx={{
        display: "flex",
        gap: "2rem",
      }}
      align={actionColumn.align}
    >
      {onEdit && (
        <IconButton
          color="primary"
          onClick={() =>
            onEdit(
              item.showTimeId ||
                item.userId ||
                item.roomId ||
                item.MaNhanVien ||
                item.movieId ||
                "",
            )
          }
        >
          <Edit />
        </IconButton>
      )}
      {onDelete && item.status === 1 && (
        <IconButton
          color="secondary"
          onClick={() =>
            onDelete(
              item.showTimeId ||
                item.userId ||
                item.roomId ||
                item.MaNhanVien ||
                item.movieId ||
                "",
            )
          }
        >
          <Delete />
        </IconButton>
      )}
    </TableCell>
  );

  const renderRowCells = (item: T) => {
    const cells = columns.map((column) => (
      <TableCell key={String(column.field)} align={column.align}>
        {column.renderCell ? column.renderCell(item) : item[column.field]}
      </TableCell>
    ));

    if (showActions) {
      cells.push(renderActionButtons(item));
    }

    return cells;
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {renderHeaderCells()}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={
                item.userId || item.roomId || item.MaNhanVien || item.movieId
              }
              sx={{ 
                height: `${rowHeight}px`,
                '& .MuiTableCell-root': {
                  padding: rowHeight < 53 ? '8px 16px' : undefined // Adjust padding for smaller rows
                }
              }}
            >
              {renderRowCells(item)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ManagementTable;
