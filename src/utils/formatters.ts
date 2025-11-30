export const formatDate = (date: Date | null): string => {
  if (!date) return "";
  return date.toISOString().split("T")[0];
};

export const calculateReqWgt = (
  width: string,
  length: string,
  gauge: string,
  pieces: string
): string => {
  const w = parseFloat(width) || 0;
  const l = parseFloat(length) || 0;
  const g = parseFloat(gauge) || 0;
  const p = parseFloat(pieces) || 0;

  if (w > 0 && l > 0 && g > 0 && p > 0) {
    const result = ((w * l) / (g / 3300) / 1000) * p;
    return result.toFixed(3);
  }
  return "0.000";
};
