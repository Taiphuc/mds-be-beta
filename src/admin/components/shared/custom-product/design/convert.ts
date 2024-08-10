export function WHToPx(data: number, type = 'mm', ppi = 300): number {
  if (type == 'mm') return Math.round(data * (ppi / 25.4));
  if (type == 'in') return Math.round(data * 25.4);
  return data;
}