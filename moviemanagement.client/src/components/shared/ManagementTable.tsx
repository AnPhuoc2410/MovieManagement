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
  id: string;
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
  },
}: ManagementTableProps<T>) {
  const renderHeaderCells = () => {
    const headerCells = columns.map((column) => (
      <TableCell
        key={String(column.field)}
        align={column.align}
        style={{ width: column.width }}
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
        >
          {actionColumn.headerName}
        </TableCell>,
      );
    }

    return headerCells;
  };

  const renderActionButtons = (id: string) => (
    <TableCell align={actionColumn.align}>
      {onEdit && (
        <IconButton color="primary" onClick={() => onEdit(id)}>
          <Edit />
        </IconButton>
      )}
      {onDelete && (
        <IconButton color="secondary" onClick={() => onDelete(id)}>
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
      cells.push(renderActionButtons(item.id));
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
            <TableRow key={item.id}>{renderRowCells(item)}</TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ManagementTable;
