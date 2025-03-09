export const styles = {
  pageWrapper: {
    background: `
      radial-gradient(circle at 20% 30%, rgba(78, 46, 131, 0.4) 0%, rgba(78, 46, 131, 0) 50%),
      radial-gradient(circle at 75% 15%, rgba(33, 64, 154, 0.4) 0%, rgba(33, 64, 154, 0) 50%),
      linear-gradient(135deg, #0B0D1A 0%, #1A1E3C 50%, #3A1155 100%)
    `,
    minHeight: "100vh",
    color: "white",
    position: "relative",
    zIndex: 1,
    overflow: "hidden",
  },
  modal: {
    "& .MuiBox-root": {
      width: { xs: "95%", sm: "80%" },
      maxWidth: "1000px",
    },
  },
  modalBox: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: "1000px",
    bgcolor: "rgba(0, 0, 0, 0.9)",
    boxShadow: 24,
    outline: "none",
    borderRadius: 2,
  },
  closeButton: {
    position: "absolute",
    right: 8,
    top: 8,
    color: "white",
    bgcolor: "rgba(0, 0, 0, 0.5)",
    "&:hover": {
      bgcolor: "rgba(131, 75, 255, 0.7)",
    },
    zIndex: 1,
  },
  bannerImage: {
    width: "100%",
    height: "auto",
    maxHeight: "80vh",
    objectFit: "cover",
    borderRadius: "8px",
  },
  auroraWrapper: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    pointerEvents: "none",
  },
  mainContent: {
    paddingTop: { xs: "80px", sm: "90px", md: "100px" },
    position: "relative",
    zIndex: 1,
    px: { xs: 2, sm: 3, md: 4 },
  },
  bannerContainer: {
    color: "white",
    mb: 3,
    mt: 2,
  },
};
