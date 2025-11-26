// app/actions.ts
import { supabase } from "@/lib/supabase";

/**
 * Insert a note. This must be called from the browser (user session present).
 * Returns the inserted note object on success, or throws an Error.
 */
export async function addNoteClient(
  user_id: string,
  title: string,
  content: string,
  tags: string[] = []
) {
  if (!user_id) throw new Error("Missing user_id");

  // clean tags
  const cleanTags = (tags || []).filter(Boolean);

  const { data, error } = await supabase
    .from("notes")
    .insert([{ user_id, title, content, tags: cleanTags }])
    .select()
    .single();

  if (error) {
    // include full error for debugging
    throw new Error(error.message || JSON.stringify(error));
  }
  return data;
}

/**
 * Fetch notes for a specific user.
 */
export async function fetchNotesClient(user_id: string) {
  if (!user_id) throw new Error("Missing user_id");

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || JSON.stringify(error));
  }
  return data || [];
}

/**
 * Delete a note by id (user must be owner — RLS will enforce)
 */
export async function deleteNoteClient(note_id: string) {
  if (!note_id) throw new Error("Missing note id");

  const { error } = await supabase.from("notes").delete().eq("id", note_id);

  if (error) {
    throw new Error(error.message || JSON.stringify(error));
  }
  return true;
}
