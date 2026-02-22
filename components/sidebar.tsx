"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  FileText,
  Calendar,
  Sparkles,
  GraduationCap,
  ChevronDown,
  BookOpen,
  Users,
  Library,
  Settings,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isResearchOpen, setIsResearchOpen] = useState(true);
  const [isCampusOpen, setIsCampusOpen] = useState(false);

  return (
    <div className={cn("flex flex-col h-full bg-[#0a0a0a] text-zinc-300 w-64 border-r border-zinc-800", className)}>
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800/50">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-md flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base text-white tracking-tight leading-none">ThesisAI</span>
            <span className="text-[10px] text-zinc-500 font-medium tracking-widest uppercase mt-0.5">Workspace</span>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden text-zinc-500 hover:text-white hover:bg-zinc-800">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
        {/* Workspace */}
        <div className="space-y-1">
          <div className="px-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Overview
          </div>
          <Link href="/">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 font-medium h-9 px-3",
                pathname === "/" 
                  ? "bg-zinc-800/50 text-white" 
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/30"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/30 h-9 px-3"
          >
            <FileText className="h-4 w-4" />
            Documents
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/30 h-9 px-3"
          >
            <Calendar className="h-4 w-4" />
            Calendar
          </Button>
        </div>

        {/* Academic Suite */}
        <div className="space-y-1">
          <div className="px-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Tools
          </div>
          
          {/* Research Engine Group */}
          <div>
            <Button
              variant="ghost"
              className="w-full justify-between font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/30 h-9 px-3 group"
              onClick={() => setIsResearchOpen(!isResearchOpen)}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4" />
                Research Engine
              </div>
              <ChevronDown className={cn("h-4 w-4 transition-transform text-zinc-600 group-hover:text-zinc-400", isResearchOpen && "rotate-180")} />
            </Button>
            
            {isResearchOpen && (
              <div className="mt-1 ml-4 pl-4 border-l border-zinc-800 space-y-1">
                <Button variant="ghost" size="sm" className="w-full justify-start gap-3 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30 h-8 px-3 text-xs">
                  <Library className="h-3.5 w-3.5" />
                  Scholar Toolkit
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start gap-3 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30 h-8 px-3 text-xs">
                  <BookOpen className="h-3.5 w-3.5" />
                  References
                </Button>
              </div>
            )}
          </div>

          {/* Campus Group */}
          <div>
            <Button
              variant="ghost"
              className="w-full justify-between font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/30 h-9 px-3 group"
              onClick={() => setIsCampusOpen(!isCampusOpen)}
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="h-4 w-4" />
                Campus
              </div>
              <ChevronDown className={cn("h-4 w-4 transition-transform text-zinc-600 group-hover:text-zinc-400", isCampusOpen && "rotate-180")} />
            </Button>
            
            {isCampusOpen && (
              <div className="mt-1 ml-4 pl-4 border-l border-zinc-800 space-y-1">
                <Button variant="ghost" size="sm" className="w-full justify-start gap-3 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30 h-8 px-3 text-xs">
                  <Users className="h-3.5 w-3.5" />
                  Community
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Credits */}
      <div className="p-4 border-t border-zinc-800/50">
        <div className="bg-zinc-900/50 rounded-lg p-4 space-y-3 border border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-zinc-500 tracking-wider">USAGE</span>
            <span className="text-[9px] bg-white text-black px-1.5 py-0.5 rounded-sm font-bold tracking-wider">PRO</span>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-white">450 <span className="text-xs text-zinc-500 font-normal">/ 2000</span></span>
              <span className="text-[10px] text-zinc-500">Tokens</span>
            </div>
            <Progress value={22.5} className="h-1 bg-zinc-800" indicatorClassName="bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
