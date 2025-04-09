import Cancel from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ManIcon from "@mui/icons-material/Man";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WomanIcon from "@mui/icons-material/Woman";
import { Avatar, Box, Chip, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "react-query";
import { useLocation, useNavigate } from "react-router";
import { createSwapy, Swapy } from "swapy";
import { doInActiveUser, fetchUserByRole, Role } from "../../../apis/user.apis";
import { StatCardData } from "../../../components/stats/StatCard";
import ManagementPageLayout from "../../../layouts/ManagementLayout";
import { UserResponse } from "../../../types/users.type";
import XoaNhanVien from "./XoaNhanVien";
import { dateFormatter } from "../../../utils/dateTime.utils";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const QuanLiNhanVien: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [selectedEmployee, setSelectedEmployee] = useState<UserResponse | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const swapyRef = useRef<Swapy | null>(null);
  const statsContainerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  // Media queries for responsive design
  const isXsScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isMdScreen = useMediaQuery(theme.breakpoints.down("lg"));

  const [statsOrder, setStatsOrder] = useState<string[]>(["employees", "active", "inactive", "male", "female"]);

  const {
    data: employees,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", "employees"],
    queryFn: async () => {
      const response = await fetchUserByRole(Role.Employee);
      if (!response.isSuccess || !response.data) {
        throw new Error(response.message || "Failed to fetch employees");
      }
      return response.data;
    },
  });

  // Calculate statistics from employee data
  const totalEmployees = employees?.length || 0;
  const activeEmployees = employees?.filter((emp) => emp.status === 1).length || 0;
  const inactiveEmployees = totalEmployees - activeEmployees;
  const maleEmployees = employees?.filter((emp) => emp.gender === 1).length || 0;
  const femaleEmployees = employees?.filter((emp) => emp.gender === 2).length || 0;

  // Define stats cards data
  const statsCards: Record<string, StatCardData> = {
    employees: {
      id: "employees",
      title: t("common.stats.total_employees") || "Total Employees",
      value: totalEmployees,
      icon: <PeopleAltIcon sx={{ fontSize: 40 }} />,
      color: "#4051B5",
    },
    active: {
      id: "active",
      title: t("common.stats.active_employees") || "Active Employees",
      value: activeEmployees,
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      color: "#4CAF50",
    },
    inactive: {
      id: "inactive",
      title: t("common.stats.inactive_employees") || "Inactive Employees",
      value: inactiveEmployees,
      icon: <Cancel sx={{ fontSize: 40 }} />,
      color: "#E50046",
    },
    male: {
      id: "male",
      title: t("common.stats.male_employees") || "Male Employees",
      value: maleEmployees,
      icon: <ManIcon sx={{ fontSize: 40 }} />,
      color: "#2196F3",
    },
    female: {
      id: "female",
      title: t("common.stats.female_employees") || "Female Employees",
      value: femaleEmployees,
      icon: <WomanIcon sx={{ fontSize: 40 }} />,
      color: "#E91E63",
    },
  };

  // Initialize Swapy after the component is fully rendered
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (statsContainerRef.current) {
      // Use setTimeout to ensure DOM is fully rendered
      timer = setTimeout(() => {
        try {
          swapyRef.current = createSwapy(statsContainerRef.current!, {
            animation: "spring",
            swapMode: "drop",
            autoScrollOnDrag: true,
            enabled: true,
            dragAxis: "both",
            dragOnHold: false,
          });

          swapyRef.current.onSwap((event) => {
            console.log("Swap occurred:", event);
            // Update the order of stats cards when swapped
            const { fromSlot, toSlot } = event;
            setStatsOrder((prevOrder) => {
              const newOrder = [...prevOrder];
              const fromIndex = prevOrder.findIndex((id) => id === fromSlot);
              const toIndex = prevOrder.findIndex((id) => id === toSlot);

              if (fromIndex !== -1 && toIndex !== -1) {
                [newOrder[fromIndex], newOrder[toIndex]] = [newOrder[toIndex], newOrder[fromIndex]];
              }

              return newOrder;
            });
          });
        } catch (e) {
          console.error("Swapy initialization error:", e);
          // Fallback to non-draggable if Swapy fails
        }
      }, 100);
    }

    return () => {
      clearTimeout(timer);
      if (swapyRef.current) {
        try {
          swapyRef.current.destroy();
        } catch (e) {
          console.error("Error destroying Swapy:", e);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load employees");
    }
  }, [error, location]);

  const handleEdit = (id: string) => navigate(`/admin/ql-nhan-vien/${id}`);

  const handleDelete = (username: string) => {
    const employeeToDelete = employees?.find((emp) => emp.userName === username);
    if (employeeToDelete) {
      setSelectedEmployee(employeeToDelete);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedEmployee) {
      try {
        const res = await doInActiveUser(selectedEmployee.userId);
        if (res) {
          toast.success(t("toast.employee.deleteSuccess"));
          queryClient.invalidateQueries(["users", "employees"]);
        }
      } catch (error) {
        toast.error(t("toast.employee.deleteFailed"));
      }
    }
    setIsDeleteDialogOpen(false);
    setSelectedEmployee(null);
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "userName",
        headerName: t("common.table_header.user.username"),
        width: 250,
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar src={params.row.avatar || "/default-avatar.png"} alt={params.row.fullName} />
            <span>{params.row.userName}</span>
          </Box>
        ),
      },
      {
        field: "fullName",
        headerName: t("common.table_header.user.fullname"),
        width: 180,
      },
      {
        field: "email",
        headerName: t("common.table_header.user.email"),
        width: 220,
      },
      {
        field: "phoneNumber",
        headerName: t("common.table_header.user.phone"),
        width: 130,
      },
      {
        field: "status",
        headerName: t("common.table_header.user.status"),
        width: 120,
        renderCell: (params) => (
          <Chip
            label={params.row.status === 1 ? "Active" : "Inactive"}
            color={params.row.status === 1 ? "success" : "error"}
            sx={{
              fontWeight: "bold",
              borderRadius: "16px",
              minWidth: "80px",
            }}
          />
        ),
      },
      {
        field: "address",
        headerName: t("common.table_header.user.address"),
        width: 130,
      },
      {
        field: "actions",
        headerName: t("common.table_header.actions"),
        type: "actions",
        width: 100,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => handleEdit(params.row.userId)}
            disabled={params.row.status !== 1}
            sx={{
              color: params.row.status !== 1 ? "gray" : "inherit",
              opacity: params.row.status !== 1 ? 0.5 : 1,
            }}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDelete(params.row.userName)}
            showInMenu
            disabled={params.row.status !== 1}
            sx={{
              color: params.row.status !== 1 ? "gray" : "inherit",
              opacity: params.row.status !== 1 ? 0.5 : 1,
            }}
          />,
        ],
      },
    ],
    [t],
  );

  return (
    <ManagementPageLayout>
      {/* Stats Cards - Responsive Swapy container */}
      <div
        ref={statsContainerRef}
        className="swapy-container"
        style={{
          marginBottom: "1.5rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          justifyContent: "center",
        }}
      >
        {statsOrder.map((cardId) => (
          <div
            key={cardId}
            className="swapy-slot"
            data-swapy-slot={cardId}
            style={{
              margin: "4px",
              flex: isXsScreen ? "1 1 100%" : isSmScreen ? "1 1 45%" : "1 1 230px",
              minWidth: isXsScreen ? "100%" : "230px",
              maxWidth: isXsScreen ? "100%" : "350px",
              display: "inline-block",
            }}
          >
            <div className="swapy-item" data-swapy-item={cardId} style={{ cursor: "grab" }}>
              <Paper
                elevation={3}
                sx={{
                  p: isXsScreen ? 2 : 3,
                  borderRadius: 2,
                  height: "100%",
                  borderLeft: `5px solid ${statsCards[cardId].color}`,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Box>
                  <Typography variant={isXsScreen ? "subtitle1" : "h6"} fontWeight="bold">
                    {statsCards[cardId].title}
                  </Typography>
                  <Typography variant={isXsScreen ? "h5" : "h4"} fontWeight="bold" mt={1}>
                    {statsCards[cardId].value}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: `${statsCards[cardId].color}20`,
                    p: isXsScreen ? 1.5 : 2,
                    ml: 2,
                    borderRadius: "50%",
                    color: statsCards[cardId].color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {React.cloneElement(statsCards[cardId].icon as React.ReactElement, {
                    sx: { fontSize: isXsScreen ? 30 : 40 },
                  })}
                </Box>
              </Paper>
            </div>
          </div>
        ))}
      </div>

      <Box
        sx={{
          width: "100%",
          height: 600,
          "& .MuiDataGrid-root": {
            border: "none",
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 1,
            "& .MuiDataGrid-columnHeaders": {
              color: "black",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f0f0f0",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f5f5f5",
            },
          },
        }}
      >
        <DataGrid
          rows={employees || []}
          columns={columns}
          loading={isLoading}
          getRowId={(row) => row.userId}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          autoHeight
        />
      </Box>

      <XoaNhanVien
        isDialogOpen={isDeleteDialogOpen}
        handleCloseDialog={() => {
          setIsDeleteDialogOpen(false);
          setSelectedEmployee(null);
        }}
        handleConfirmDelete={handleConfirmDelete}
        employeeData={selectedEmployee}
      />
    </ManagementPageLayout>
  );
};

export default QuanLiNhanVien;
