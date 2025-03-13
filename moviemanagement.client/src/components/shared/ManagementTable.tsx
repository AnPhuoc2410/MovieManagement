import React from "react";
import {
  Avatar,
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

// Base interface for table data with string id
export interface TableData {
  userId?: string;
  MaNhanVien?: string;
  movieId?: string;
  roomId?: string;
  [key: string]: any;
}

// Interface for column definition
export interface ColumnDef<T extends TableData> {
  field: keyof T;
  headerName: string;
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
  actionColumn?: {
    align?: "left" | "center" | "right";
    width?: string | number;
    headerName?: string;
    backgroundColor?: string;
  };
}

// Default user columns that can be reused
export const defaultUserColumns: ColumnDef<UserResponse>[] = [
  {
    field: "avatar",
    headerName: "Avatar",
    align: "center",
    width: "80px",
    renderCell: (item) => (
      <Avatar 
        src={item.avatar || "/default-avatar.png"} 
        alt={item.fullName}
      />
    ),
  },
  {
    field: "userName",
    headerName: "Username",
    align: "left",
  },
  {
    field: "fullName",
    headerName: "Full Name",
    align: "left",
  },
  {
    field: "email",
    headerName: "Email",
    align: "left",
  },
  {
    field: "phoneNumber",
    headerName: "Phone",
    align: "left",
  },
  {
    field: "status",
    headerName: "Status",
    align: "center",
    renderCell: (item) => (
      <span style={{ color: item.status === 1 ? "green" : "red" }}>
        {item.status === 1 ? "Active" : "Inactive"}
      </span>
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
  actionColumn = {
    align: "center",
    headerName: "Actions",
    width: "120px",
    backgroundColor: "#FFA09B",
  },
}: ManagementTableProps<T>) {
  if (isLoading) return <Loader />;

  const renderHeaderCells = () => {
    const headerCells = columns.map((column) => (
      <TableCell
        key={String(column.field)}
        align={column.align}
        style={{ width: column.width }}
        sx={{
          backgroundColor: "#FFA09B", // Change to your preferred color
          fontWeight: "bold", // Optional: make the text bold
        }}
      >
        {column.headerName}
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
          {actionColumn.headerName}
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
            onEdit(item.userId || item.roomId || item.MaNhanVien || item.movieId || "")
          }
        >
          <Edit />
        </IconButton>
      )}
      {onDelete && (
        <IconButton
          color="secondary"
          onClick={() =>
            onDelete(item.userId || item.roomId || item.MaNhanVien || item.movieId || "")
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
          <TableRow>{renderHeaderCells()}</TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.userId || item.roomId || item.MaNhanVien || item.movieId}>
              {renderRowCells(item)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ManagementTable;
