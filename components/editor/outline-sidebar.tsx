import { Project, OutlineItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus, ChevronRight, ChevronDown, FileText, Sparkles, ListTree } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface OutlineSidebarProps {
  outline: OutlineItem[];
  onUpdateOutline: (outline: OutlineItem[]) => void;
  onGenerateOutline: () => void;
}

export function OutlineSidebar({ outline, onUpdateOutline, onGenerateOutline }: OutlineSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <div className="w-12 bg-zinc-50/50 flex flex-col items-center py-4 h-full border-r border-zinc-200">
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50">
          <ListTree className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-zinc-50/50 flex flex-col h-full border-r border-zinc-200">
      <div className="h-12 border-b border-zinc-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-zinc-900">
          <ListTree className="h-4 w-4 text-zinc-500" />
          <span className="font-semibold text-xs uppercase tracking-wider text-zinc-600">Document Outline</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/50 -mr-2" onClick={() => setIsOpen(false)}>
          <ChevronRight className="h-4 w-4 rotate-180" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {outline.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-zinc-300 rounded-lg bg-white mt-4 mx-1">
            <div className="bg-zinc-100 h-8 w-8 rounded-full flex items-center justify-center mx-auto mb-3">
              <ListTree className="h-4 w-4 text-zinc-400" />
            </div>
            <p className="text-xs text-zinc-500 mb-4">Structure your document with an outline.</p>
            <Button size="sm" className="w-full text-xs bg-zinc-900 hover:bg-zinc-800 text-white h-8" onClick={onGenerateOutline}>
              <Sparkles className="h-3 w-3 mr-1.5" />
              Auto-Generate
            </Button>
          </div>
        ) : (
          outline.map((item) => (
            <div
              key={item.id}
              className={cn(
                "group flex items-center px-2.5 py-1.5 text-sm rounded-md hover:bg-zinc-200/50 cursor-pointer text-zinc-600 transition-colors",
                item.level === 1 && "font-medium text-zinc-900 mt-2 mb-1",
                item.level === 2 && "pl-6 text-[13px]",
                item.level === 3 && "pl-10 text-xs text-zinc-500"
              )}
            >
              <div className={cn(
                "w-1 h-1 rounded-full mr-2.5 flex-shrink-0",
                item.level === 1 ? "bg-zinc-400" : "bg-transparent border border-zinc-300"
              )} />
              <span className="truncate">{item.title}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
