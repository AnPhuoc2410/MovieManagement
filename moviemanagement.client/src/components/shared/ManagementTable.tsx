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

// Base interface for table data with string id
export interface TableData {
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
  data: T[];
  columns: ColumnDef<T>[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
  actionColumn?: {
    align?: "left" | "center" | "right";
    width?: string | number;
    headerName?: string;
    backgroundColor?: string;
  };
}

function ManagementTable<T extends TableData>({
  data,
  columns,
  onEdit,
  onDelete,
  showActions = true,
  actionColumn = {
    align: "center",
    headerName: "Actions",
    width: "120px",
    backgroundColor: "#FFA09B",
  },
}: ManagementTableProps<T>) {
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
        <IconButton color="primary" onClick={() => onEdit(item.MaNhanVien)}>
          <Edit />
        </IconButton>
      )}
      {onDelete && (
        <IconButton color="secondary" onClick={() => onDelete(item.MaNhanVien)}>
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
            <TableRow key={item.MaNhanVien}>{renderRowCells(item)}</TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ManagementTable;
