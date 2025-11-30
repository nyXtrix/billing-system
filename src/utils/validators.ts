export const validateInput = (field: string, value: string): string => {
  switch (field) {
    case "width":
    case "length":
    case "flop":
    case "rate":
      return /^\d*(\.\d{0,2})?$/.test(value) ? value : "";
    case "gauge":
    case "pieces":
      return /^\d*$/.test(value) ? value : "";
    case "weight":
      return /^\d*(\.\d{0,3})?$/.test(value) ? value : "";
    case "product":
    case "remarks":
    case "rateFor":
      return value;
    default:
      return value;
  }
};
