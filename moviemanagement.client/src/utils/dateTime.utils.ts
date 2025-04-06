import { format, isValid, parseISO } from "date-fns";

export const dateFormatter = (params: { value: string | number | Date }) => {
  try {
    let date;

    console.log("params.value:", params.value);

    // Handle different types of input
    if (typeof params.value === "string") {
      // Parse ISO string
      date = parseISO(params.value);
    } else if (params.value instanceof Date) {
      date = params.value;
    } else if (typeof params.value === "number") {
      date = new Date(params.value);
    } else {
      return "Invalid Date";
    }

    // Check if the date is valid
    if (!isValid(date)) {
      return "Invalid Date";
    }

    // Format the date using date-fns
    return format(date, "MMM d, yyyy HH:mm"); // Example format: "Mar 12, 2025 15:48"
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};
