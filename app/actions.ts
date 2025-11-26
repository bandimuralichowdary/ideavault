"use client";


import { createClient } from "@supabase/supabase-js";

function serverClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/** Insert a new note */
export async function addNoteClient(
  user_id: string,
  title: string,
  content: string,
  tags: string[] = []
) {
  if (!user_id) throw new Error("Missing user_id");

  const supabase = serverClient();
  const cleanTags = tags.filter(Boolean);

  const { data, error } = await supabase
    .from("notes")
    .insert([{ user_id, title, content, tags: cleanTags }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch all notes for a user */
export async function fetchNotesClient(user_id: string) {
  if (!user_id) throw new Error("Missing user_id");

  const supabase = serverClient();

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

/** Delete a note */
export async function deleteNoteClient(note_id: string) {
  if (!note_id) throw new Error("Missing note_id");

  const supabase = serverClient();

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", note_id);

  if (error) throw new Error(error.message);
  return true;
}
