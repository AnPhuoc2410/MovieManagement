import { Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { format } from "date-fns";

export interface ShowTime {
  id?: string;
  showTimeId: string;
  movieId?: string;
  roomId: string;
  startTime: string;
  endTime: string;
  movie: {
    movieName: string;
  };
  room: {
    roomName: string;
  };
}

const ShowTimeTable: React.FC<{
  showTimes: ShowTime[];
  onEdit: (id: string) => void;
}> = ({ showTimes }) => {
  const navigate = useNavigate();

  const handleEditClick = (showTimeId: string) => {
    console.log("Handling click for showTimeId:", showTimeId);
    console.log("Available showTimes:", showTimes);

    if (showTimeId) {
      navigate(`/admin/ql-thoi-gian-chieu/${showTimeId}`);
    } else {
      console.error("No showTimeId provided");
    }
  };

  // Format date properly for display and sorting
  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (e) {
      return dateString || "N/A";
    }
  };

  // Transform the data for DataGrid to allow proper sorting
  const rows = showTimes.map(showtime => ({
    ...showtime,
    id: showtime.showTimeId,
    movieName: showtime.movie?.movieName || "N/A",
    roomName: showtime.room?.roomName || "N/A",
    formattedStartTime: formatDateTime(showtime.startTime),
    formattedEndTime: formatDateTime(showtime.endTime)
  }));

  const columns: GridColDef[] = [
    {
      field: "movieName",
      headerName: "Tên phim",
      flex: 1,
      sortable: true,
    },
    {
      field: "roomName",
      headerName: "Tên phòng chiếu",
      width: 180,
      sortable: true,
    },
    {
      field: "formattedStartTime",
      headerName: "Thời gian chiếu",
      width: 180,
      sortable: true,
    },
    {
      field: "formattedEndTime",
      headerName: "Thời gian kết thúc",
      width: 180,
      sortable: true,
    },
    {
      field: "actions",
      headerName: "Chi tiết",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          startIcon={<EditIcon />}
          onClick={() => handleEditClick(params.row.showTimeId)}
        >
          Chi tiết
        </Button>
      )
    }
  ];

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "1rem",  
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textAlign: "left",
            flexGrow: 1,
          }}
        >
          Danh sách thời gian chiếu
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{
            flexShrink: 0, // Prevent button from shrinking
          }}
          onClick={() => {
            navigate("/admin/ql-thoi-gian-chieu/them-thoi-gian-chieu");
          }}
        >
          Thêm thời gian chiếu
        </Button>
      </Box>
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          pageSizeOptions={[5, 10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
            sorting: {
              sortModel: [{ field: 'formattedStartTime', sort: 'desc' }],
            },
          }}
          getRowId={(row) => row.id}
          density="standard"
          disableRowSelectionOnClick
          autoHeight
        />
      </Box>
    </>
  );
};

export default ShowTimeTable;
