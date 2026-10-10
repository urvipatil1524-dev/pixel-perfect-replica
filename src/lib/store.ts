import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

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
  contactName?: string;
  contactPhone?: string;
  description?: string;
  preferredDate?: string;
};

type DbItem = {
  id: string;
  kind: Item["kind"];
  type: string;
  location: string;
  date: string;
  status: Status;
  collector: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  description: string | null;
  preferred_date: string | null;
};

function database() {
  const url = process.env["SUPABASE_URL"];
  const secretKey = process.env["SUPABASE_SECRET_KEY"];
  if (!url || !secretKey) {
    throw new Error("Supabase is not configured. Add SUPABASE_URL and SUPABASE_SECRET_KEY to the server environment.");
  }
  return createClient(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function assertAdmin() {
  const { auth, clerkClient } = await import("@clerk/tanstack-react-start/server");
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated || !userId) throw new Error("Sign in is required.");
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  if (user.publicMetadata["role"] !== "admin") throw new Error("Admin access is required.");
}

const publicRequestSchema = z.object({
  kind: z.enum(["Complaint", "Pickup"]),
  type: z.string().trim().min(2).max(80),
  location: z.string().trim().min(3).max(300),
  contactName: z.string().trim().max(120).optional(),
  contactPhone: z.string().trim().max(24).optional(),
  description: z.string().trim().max(1000).optional(),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export const addItem = createServerFn({ method: "POST" })
  .validator(publicRequestSchema)
  .handler(async ({ data }): Promise<Item> => {
    const prefix = data.kind === "Complaint" ? "CMP" : "PKP";
    const id = `${prefix}-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
    const row = {
      id,
      kind: data.kind,
      type: data.type,
      location: data.location,
      contact_name: data.contactName ?? null,
      contact_phone: data.contactPhone ?? null,
      description: data.description ?? null,
      preferred_date: data.preferredDate ?? null,
      date: new Date().toISOString().slice(0, 10),
      status: "Submitted" as const,
    };
    const { data: saved, error } = await database()
      .from("requests")
      .insert(row)
      .select("id, kind, type, location, date, status, collector, contact_name, contact_phone, description, preferred_date")
      .single();
    if (error) throw new Error("Could not save your request. Please try again.");
    return fromRow(saved as DbItem);
  });

export const getItems = createServerFn({ method: "GET" })
  .handler(async (): Promise<Item[]> => {
    await assertAdmin();
    const { data, error } = await database()
      .from("requests")
      .select("id, kind, type, location, date, status, collector, contact_name, contact_phone, description, preferred_date")
      .order("created_at", { ascending: false });
    if (error) throw new Error("Could not load requests from Supabase.");
    return (data as DbItem[]).map(fromRow);
  });

export const saveItem = createServerFn({ method: "POST" })
  .validator(z.object({
    id: z.string().min(1).max(80),
    patch: z.object({
      status: z.enum(["Submitted", "Assigned", "In Progress", "Resolved"]).optional(),
      collector: z.string().max(100).nullable().optional(),
    }).refine((patch) => patch.status !== undefined || patch.collector !== undefined),
  }))
  .handler(async ({ data }): Promise<Item> => {
    await assertAdmin();
    const { data: updated, error } = await database()
      .from("requests")
      .update({ ...data.patch })
      .eq("id", data.id)
      .select("id, kind, type, location, date, status, collector, contact_name, contact_phone, description, preferred_date")
      .single();
    if (error) throw new Error("Could not update this request.");
    return fromRow(updated as DbItem);
  });

export const findItem = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().trim().min(1).max(80) }))
  .handler(async ({ data }): Promise<Item | null> => {
    const { data: row, error } = await database()
      .from("requests")
      .select("id, kind, type, location, date, status, collector")
      .ilike("id", data.id)
      .maybeSingle();
    if (error) throw new Error("Could not look up this request right now.");
    return row ? {
      id: row.id,
      kind: row.kind as Item["kind"],
      type: row.type,
      location: row.location,
      date: row.date,
      status: row.status as Status,
      ...(row.collector ? { collector: row.collector } : {}),
    } : null;
  });

function fromRow(row: DbItem): Item {
  return {
    id: row.id,
    kind: row.kind,
    type: row.type,
    location: row.location,
    date: row.date,
    status: row.status,
    ...(row.collector ? { collector: row.collector } : {}),
    ...(row.contact_name ? { contactName: row.contact_name } : {}),
    ...(row.contact_phone ? { contactPhone: row.contact_phone } : {}),
    ...(row.description ? { description: row.description } : {}),
    ...(row.preferred_date ? { preferredDate: row.preferred_date } : {}),
  };
}
