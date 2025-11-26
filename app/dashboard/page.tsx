"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { addNoteClient, fetchNotesClient, deleteNoteClient } from "../actions";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return router.replace("/login");

      setUser(data.user);
      try {
        const fetchedNotes = await fetchNotesClient(data.user.id);
        setNotes(fetchedNotes);
      } catch (err: any) {
        console.error("Fetch notes failed:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  async function handleAddNote() {
    if (!title.trim() && !content.trim()) return alert("Cannot add empty note");

    const tagsArr = tags.split(",").map((t) => t.trim()).filter(Boolean);
    try {
      const newNote = await addNoteClient(user.id, title, content, tagsArr);
      setNotes([newNote, ...notes]);
      setTitle(""); setContent(""); setTags("");
    } catch (err: any) {
      console.error("Add note failed:", err);
      alert(err.message || "Error adding note");
    }
  }

  async function handleDeleteNote(id: string) {
    try {
      await deleteNoteClient(id);
      setNotes(notes.filter((n) => n.id !== id));
    } catch (err: any) {
      console.error("Delete note failed:", err);
      alert("Failed to delete note");
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-gray-400 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#1a1a1a]">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#1a1a1a] text-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-8">
          IdeaVault 🚀
        </h1>

        {/* Input Box */}
        <div className="mt-6 p-6 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600 blur-2xl opacity-30 animate-gradient-x"></div>
          <div className="relative glass-box p-6 rounded-3xl border border-white/10 backdrop-blur-md shadow-xl">
            <input
              placeholder="Title"
              className="lux-input placeholder-gray-400 text-gray-100"
              value={title} onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Content"
              className="lux-input min-h-[140px] placeholder-gray-400 text-gray-100"
              value={content} onChange={(e) => setContent(e.target.value)}
            />
            <input
              placeholder="Tags (comma separated)"
              className="lux-input placeholder-gray-400 text-gray-100"
              value={tags} onChange={(e) => setTags(e.target.value)}
            />
            <button onClick={handleAddNote} className="lux-btn primary mt-4">Add Note</button>
            <button
              onClick={async () => { await supabase.auth.signOut(); router.replace("/login"); }}
              className="lux-btn danger mt-3"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Notes List */}
        <div className="mt-12 space-y-6">
          {notes.length === 0 ? (
            <p className="text-gray-400 text-center">No notes yet. Add your first idea!</p>
          ) : (
            notes.map(note => (
              <div key={note.id} className="lux-card relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600 blur-2xl opacity-20 animate-gradient-x rounded-2xl"></div>
                <div className="relative p-6 rounded-2xl border border-white/10 backdrop-blur-md shadow-xl">
                  <h3 className="text-2xl font-semibold text-white">{note.title}</h3>
                  <p className="text-gray-200 mt-2 whitespace-pre-wrap">{note.content}</p>
                  {note.tags?.length > 0 && (
                    <p className="text-sm text-gray-400 mt-3">Tags: {note.tags.join(", ")}</p>
                  )}
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-300 transition text-xl"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
