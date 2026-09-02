"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function MarkdownEditor({ value, onChange, placeholder = "Write in markdown…", rows = 8 }: MarkdownEditorProps) {
  const [preview, setPreview] = useState(false);

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-2 text-xs">
          <button type="button" onClick={() => setPreview(false)} className={cn("px-2 py-1 rounded", !preview ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400")}>Edit</button>
          <button type="button" onClick={() => setPreview(true)} className={cn("px-2 py-1 rounded", preview ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400")}>Preview</button>
        </div>
        <div className="flex gap-1 text-xs text-gray-400">
          <button type="button" onClick={() => onChange(value + "**bold**")} className="px-1 hover:text-gray-600">B</button>
          <button type="button" onClick={() => onChange(value + "*italic*")} className="px-1 hover:text-gray-600 italic">I</button>
          <button type="button" onClick={() => onChange(value + "\n- ")} className="px-1 hover:text-gray-600">•</button>
          <button type="button" onClick={() => onChange(value + "\n## ")} className="px-1 hover:text-gray-600">H</button>
          <button type="button" onClick={() => onChange(value + "\n```\n")} className="px-1 hover:text-gray-600 font-mono">{"{ }"}</button>
        </div>
      </div>

      {preview ? (
        <div className="p-3 min-h-[200px] prose prose-sm dark:prose-invert max-w-none text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
          {value || <span className="text-gray-400 italic">Nothing to preview</span>}
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full p-3 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none resize-y min-h-[200px] font-mono"
        />
      )}
    </div>
  );
}
