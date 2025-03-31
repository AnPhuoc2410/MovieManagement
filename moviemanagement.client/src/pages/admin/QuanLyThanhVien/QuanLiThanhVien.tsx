import { AddCircle, Cancel } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Avatar, Box, Chip, Paper, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router";
import { createSwapy, Swapy } from "swapy";
import { fetchUserByRole, Role } from "../../../apis/user.apis";
import { StatCardData } from "../../../components/stats/StatCard";
import ManagementPageLayout from "../../../layouts/ManagementLayout";

const QuanLiThanhVien: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const swapyRef = useRef<Swapy | null>(null);
  const statsContainerRef = useRef<HTMLDivElement>(null);
  const [statsOrder, setStatsOrder] = useState<string[]>([
    "members",
    "active",
    "points",
    "newMembers",
    // "maleMembers",
    // "femaleMembers",
    "inactive",
  ]);

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", "members"],
    queryFn: async () => {
      const response = await fetchUserByRole(Role.Member);
      if (!response.isSuccess || !response.data) {
        throw new Error(response.message || "Failed to fetch members");
      }
      return response.data;
    },
  });

  // Calculate statistics from user data
  const totalMembers = users?.length || 0;
  const activeMembers = users?.filter((user) => user.status === 1).length || 0;

  const now = new Date();
  const newMembers =
    users?.filter((user) => {
      const joinDate = new Date(user.joinDate);
      return (now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24) <= 30; // Joined in the last 30 days
    }).length || 0;

  const maleMembers = users?.filter((user) => user.gender === 1).length || 0;
  const femaleMembers = users?.filter((user) => user.gender === 2).length || 0;

  const inactiveMembers = totalMembers ? totalMembers - activeMembers : 0;
  const totalPoints =
    users?.reduce((sum, user) => sum + (user.point || 0), 0) || 0;

  // Define stats cards data
  const statsCards: Record<string, StatCardData> = {
    members: {
      id: "members",
      title: t("common.stats.total_members") || "Total Members",
      value: totalMembers,
      icon: <PeopleAltIcon sx={{ fontSize: 40 }} />,
      color: "#4051B5",
    },
    active: {
      id: "active",
      title: t("common.stats.active_members") || "Active Members",
      value: activeMembers,
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      color: "#4CAF50",
    },
    newMembers: {
      id: "newMembers",
      title: t("common.stats.new_members_in30days") || "New Members",
      value: newMembers,
      icon: <AddCircle sx={{ fontSize: 40 }} />,
      color: "#4DA1A9",
    },

    maleMembers: {
      id: "maleMembers",
      title: t("common.stats.male_members") || "Male Members",
      value: maleMembers,
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      color: "#4CAF50",
    },

    femaleMembers: {
      id: "femaleMembers",
      title: t("common.stats.female_members") || "Female Members",
      value: femaleMembers,
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      color: "#4CAF50",
    },

    inactive: {
      id: "inactive",
      title: t("common.stats.inactive_members") || "Inactive Members",
      value: inactiveMembers,
      icon: <Cancel sx={{ fontSize: 40 }} />,
      color: "#E50046",
    },
    points: {
      id: "points",
      title: t("common.stats.total_points") || "Total Points",
      value: totalPoints.toLocaleString(),
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: "#FF9800",
    },
  };

  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load members",
      );
    }
  }, [error, location]);

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
                [newOrder[fromIndex], newOrder[toIndex]] = [
                  newOrder[toIndex],
                  newOrder[fromIndex],
                ];
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

  const handleEdit = (id: string) => navigate(`/admin/ql-thanh-vien/${id}`);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "userName",
        headerName: t("common.table_header.user.username") || "Username",
        width: 200,
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={params.row.avatar || "/default-avatar.png"}
              alt={params.row.fullName}
            />
            <span>{params.row.userName}</span>
          </Box>
        ),
      },
      {
        field: "fullName",
        headerName: t("common.table_header.user.fullname") || "Full Name",
        width: 180,
      },
      {
        field: "email",
        headerName: t("common.table_header.user.email") || "Email",
        width: 220,
      },
      {
        field: "phoneNumber",
        headerName: t("common.table_header.user.phone") || "Phone",
        width: 150,
      },
      {
        field: "idCard",
        headerName: t("common.table_header.user.id_card") || "Id Card",
        width: 200,
        align: "left",
        renderCell: (params) =>
          params.row.idCard === "" ? "N/A" : params.row.idCard,
      },
      {
        field: "gender",
        headerName: t("common.table_header.user.gender") || "Gender",
        width: 130,
        renderCell: (params) => (
          <Chip
            label={params.row.gender === 0 ? "Male" : "Female"}
            color={params.row.gender === 0 ? "info" : "secondary"}
            sx={{
              fontWeight: "bold",
              borderRadius: "16px",
              minWidth: "80px",
              minHeight: "30px",
            }}
          />
        ),
      },
      {
        field: "status",
        headerName: t("common.table_header.user.status") || "Status",
        align: "center",
        width: 120,
        renderCell: (params) => (
          <Chip
            label={params.row.status === 1 ? "Active" : "Inactive"}
            color={params.row.status === 1 ? "success" : "error"}
            sx={{
              fontWeight: "bold",
              borderRadius: "16px",
              minWidth: "80px",
              minHeight: "30px",
            }}
          />
        ),
      },
      {
        field: "point",
        headerName: t("common.table_header.user.points") || "Points",
        width: 130,
        type: "number",
        align: "center",
      },
      {
        field: "actions",
        headerName: t("common.table_header.actions") || "Actions",
        type: "actions",
        width: 100,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => handleEdit(params.row.userId)}
          />,
        ],
      },
    ],
    [t],
  );

  return (
    <ManagementPageLayout>
      <Box
        sx={{
          width: "100%",
          // p: 1,
          "& .MuiDataGrid-root": {
            border: "none",
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 1,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "primary.main",
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
        {/* Stats Cards - Swapy compatible structure */}
        <div
          ref={statsContainerRef}
          className="swapy-container"
          style={{ marginBottom: "1.5rem" }}
        >
          {statsOrder.map((cardId) => (
            <div
              key={cardId}
              className="swapy-slot"
              data-swapy-slot={cardId}
              style={{
                margin: "8px",
                flex: "1 1 250px",
                minWidth: "250px",
                display: "inline-block",
              }}
            >
              <div
                className="swapy-item"
                data-swapy-item={cardId}
                style={{ cursor: "grab" }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
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
                    <Typography variant="h6" fontWeight="bold">
                      {statsCards[cardId].title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" mt={1}>
                      {statsCards[cardId].value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: `${statsCards[cardId].color}20`,
                      p: 2,
                      ml: 2,
                      borderRadius: "50%",
                      color: statsCards[cardId].color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {statsCards[cardId].icon}
                  </Box>
                </Paper>
              </div>
            </div>
          ))}
        </div>

        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 1,
            p: 2,
            mb: 4,
          }}
        >
          <DataGrid
            rows={users || []}
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
      </Box>
    </ManagementPageLayout>
  );
};

export default QuanLiThanhVien;
