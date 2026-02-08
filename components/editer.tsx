"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Bold, Link2 } from "lucide-react";

type Props = {
  value?: string;
  onChange?: (html: string) => void;
};

export default function Editor({ value = "", onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
    ],
    immediatelyRender: false,
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("輸入連結", previousUrl || "");
    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="group focus-within:ring-1 focus-within:ring-sky-500 focus-within:bg-sky-50 dark:focus-within:bg-sky-950 rounded-xl bg-hoverbg dark:bg-sky-300/10 p-4 shadow-sm mt-5">
      <div className="mb-3 flex gap-4">
        <button
          className={`flex items-center gap-2 rounded-lg px-3 py-1 text-sm ${editor.isActive("bold") ? "bg-sky-700 text-white" : "bg-sky-200 dark:bg-sky-800"}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
          type="button"
        >
          <Bold size={18} /> 粗體
        </button>
        <button
          className="flex items-center gap-2 rounded-lg bg-sky-200 dark:bg-sky-800 px-3 py-1 text-sm"
          onClick={setLink}
          type="button"
        >
          <Link2 size={18} /> 新增文字連結
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="min-h-[200px] leading-6 focus-within:outline-none"
      />
    </div>
  );
}
