export type Status = "Submitted" | "Assigned" | "In Progress" | "Resolved";
export const STATUSES: Status[] = ["Submitted", "Assigned", "In Progress", "Resolved"];
export type Item = {
  id: string;
  kind: "Complaint" | "Pickup";
  type: string;
  location: string;
  date: string;
  status: Status;
  collector?: string;
};

const KEY = "swm-items";
const seed: Item[] = [
  { id: "CMP-1001", kind: "Complaint", type: "Overflowing Bin", location: "MG Road, Sector 4", date: "2026-10-07", status: "In Progress", collector: "Ravi Kumar" },
  { id: "CMP-1002", kind: "Complaint", type: "Garbage on Road", location: "Market Street", date: "2026-10-08", status: "Submitted" },
  { id: "PKP-2001", kind: "Pickup", type: "E-Waste", location: "12 Lake View Colony", date: "2026-10-09", status: "Assigned", collector: "Sita Devi" },
  { id: "CMP-1003", kind: "Complaint", type: "Illegal Dumping", location: "Near Bus Stand", date: "2026-10-05", status: "Resolved", collector: "Amit Shah" },
];

export function getItems(): Item[] {
  if (typeof window === "undefined") return seed;
  const raw = localStorage.getItem(KEY);
  if (!raw) { localStorage.setItem(KEY, JSON.stringify(seed)); return seed; }
  return JSON.parse(raw);
}
export function saveItems(items: Item[]) { localStorage.setItem(KEY, JSON.stringify(items)); }
export function addItem(i: Omit<Item, "id" | "date" | "status">): Item {
  const prefix = i.kind === "Complaint" ? "CMP" : "PKP";
  const item: Item = { ...i, id: `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`, date: new Date().toISOString().slice(0, 10), status: "Submitted" };
  saveItems([item, ...getItems()]);
  return item;
}
