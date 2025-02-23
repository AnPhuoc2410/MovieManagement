import { Avatar } from "@mui/material";
import ManagementTable, {
  ColumnDef,
  TableData,
} from "../../../components/shared/ManagementTable";

export interface ThanhVien extends TableData {
  username: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
}

const MemberTable: React.FC<{
  employees: ThanhVien[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ employees, onEdit, onDelete }) => {
  const columns: ColumnDef<ThanhVien>[] = [
    {
      field: "avatar",
      headerName: "Avatar",
      width: "80px",
      renderCell: (employee) => (
        <Avatar src={employee.avatar} alt={employee.username} />
      ),
    },
    {
      field: "username",
      headerName: "Username",
    },
    {
      field: "email",
      headerName: "Email",
    },
    {
      field: "phone",
      headerName: "Phone",
    },
    {
      field: "address",
      headerName: "Address",
    },
  ];

  return (
    <ManagementTable
      data={employees}
      columns={columns}
      onEdit={onEdit}
      onDelete={onDelete}
      actionColumn={{
        align: "center",
        headerName: "Actions",
        width: "120px",
      }}
    />
  );
};

export default MemberTable;
