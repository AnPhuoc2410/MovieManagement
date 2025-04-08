import { AddCircle, Cancel } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Avatar, Box, Chip, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
  const theme = useTheme();

  // Media queries for responsive design
  const isXsScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isMdScreen = useMediaQuery(theme.breakpoints.down("lg"));

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
  const totalPoints = users?.reduce((sum, user) => sum + (user.point || 0), 0) || 0;

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
      toast.error(error instanceof Error ? error.message : "Failed to load members");
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

  const handleEdit = (id: string) => navigate(`/admin/ql-thanh-vien/${id}`);

  // Responsive columns configuration based on screen size
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "userName",
        headerName: t("common.table_header.user.username") || "Username",
        flex: 0.5,
        minWidth: 90,
        maxWidth: isXsScreen ? 80 : 120,
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar src={params.row.avatar || "/default-avatar.png"} alt={params.row.fullName} sx={{ width: isXsScreen ? 24 : 32, height: isXsScreen ? 24 : 32 }} />
          </Box>
        ),
      },
      {
        field: "fullName",
        headerName: t("common.table_header.user.fullname") || "Full Name",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "email",
        headerName: t("common.table_header.user.email") || "Email",
        flex: 1,
        minWidth: 150,
        hide: isXsScreen,
      },
      {
        field: "phoneNumber",
        headerName: t("common.table_header.user.phone") || "Phone",
        flex: 0.8,
        minWidth: 110,
        hide: isSmScreen,
      },
      {
        field: "idCard",
        headerName: t("common.table_header.user.id_card") || "Id Card",
        flex: 0.8,
        minWidth: 120,
        hide: isMdScreen,
        align: "left",
        renderCell: (params) => (params.row.idCard === "" ? "N/A" : params.row.idCard),
      },
      {
        field: "gender",
        headerName: t("common.table_header.user.gender") || "Gender",
        flex: 0.5,
        minWidth: 80,
        maxWidth: 100,
        hide: isXsScreen,
        renderCell: (params) => (
          <Chip
            label={params.row.gender === 0 ? "Male" : "Female"}
            color={params.row.gender === 0 ? "info" : "secondary"}
            sx={{
              fontWeight: "bold",
              borderRadius: "16px",
              minWidth: isSmScreen ? "60px" : "80px",
              minHeight: isSmScreen ? "24px" : "30px",
              fontSize: isSmScreen ? "0.7rem" : "0.8rem",
            }}
          />
        ),
      },
      {
        field: "status",
        headerName: t("common.table_header.user.status") || "Status",
        align: "center",
        flex: 0.5,
        minWidth: 80,
        maxWidth: 100,
        renderCell: (params) => (
          <Chip
            label={params.row.status === 1 ? "Active" : "Inactive"}
            color={params.row.status === 1 ? "success" : "error"}
            sx={{
              fontWeight: "bold",
              borderRadius: "16px",
              minWidth: isSmScreen ? "60px" : "80px",
              minHeight: isSmScreen ? "24px" : "30px",
              fontSize: isSmScreen ? "0.7rem" : "0.8rem",
            }}
          />
        ),
      },
      {
        field: "point",
        headerName: t("common.table_header.user.points") || "Points",
        flex: 0.4,
        minWidth: 70,
        type: "number",
        align: "center",
        hide: isXsScreen,
      },
      {
        field: "actions",
        headerName: t("common.table_header.actions") || "Actions",
        type: "actions",
        flex: 0.4,
        minWidth: 60,
        getActions: (params) => [<GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => handleEdit(params.row.userId)} />],
      },
    ],
    [t, isXsScreen, isSmScreen, isMdScreen],
  );

  return (
    <ManagementPageLayout>
      <Box
        sx={{
          width: "100%",
          overflow: "hidden", // Prevent horizontal scrolling
          px: { xs: 1, sm: 2 }, // Add some padding on small screens
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
              whiteSpace: "normal", // Allow text wrapping
              padding: isXsScreen ? "8px 4px" : "8px 16px",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f5f5f5",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
              fontSize: isXsScreen ? "0.75rem" : "0.875rem",
              whiteSpace: "normal",
              lineHeight: 1.2,
              overflow: "visible",
            },
            "& .MuiDataGrid-cellContent": {
              fontSize: isXsScreen ? "0.75rem" : "0.875rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
          },
        }}
      >
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

        {/* Responsive DataGrid Container */}
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 1,
            p: { xs: 1, sm: 2 },
            mb: 4,
            width: "100%",
            overflow: "hidden", // Prevent any overflow
          }}
        >
          <DataGrid
            rows={users || []}
            columns={columns}
            loading={isLoading}
            getRowId={(row) => row.userId}
            initialState={{
              pagination: { paginationModel: { pageSize: isXsScreen ? 5 : 10 } },
              columns: {
                columnVisibilityModel: {
                  email: !isXsScreen,
                  phoneNumber: !isSmScreen,
                  idCard: !isMdScreen,
                  gender: !isXsScreen,
                  point: !isXsScreen,
                },
              },
            }}
            pageSizeOptions={isXsScreen ? [5, 10] : [5, 10, 25]}
            disableRowSelectionOnClick
            autoHeight
            density={isSmScreen ? "compact" : "standard"}
            sx={{
              width: "100%",
              "& .MuiDataGrid-virtualScroller": {
                overflow: "auto",
              },
              "& .MuiDataGrid-main": {
                width: "100%",
                overflow: "hidden",
              },
              "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-footerContainer": {
                width: "100% !important", // Force header and footer to match grid width
              },
              "& .MuiDataGrid-virtualScrollerContent": {
                width: "100% !important", // Ensure scroll content matches width
              },
            }}
          />
        </Box>
      </Box>
    </ManagementPageLayout>
  );
};

export default QuanLiThanhVien;
