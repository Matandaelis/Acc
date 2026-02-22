import { Project } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import { FileText, Trash2, Edit3, MoreVertical } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const statusColors: Record<string, string> = {
    draft: "bg-zinc-100 text-zinc-600 border-zinc-200",
    review: "bg-amber-50 text-amber-600 border-amber-200",
    published: "bg-emerald-50 text-emerald-600 border-emerald-200",
  };

  return (
    <Link href={`/editor/${project.id}`} className="block group">
      <Card className="hover:shadow-sm transition-all duration-200 relative border-zinc-200 bg-white overflow-hidden h-full">
        <div className="p-5 flex flex-col h-full gap-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-zinc-50 flex items-center justify-center flex-shrink-0 border border-zinc-200 group-hover:bg-zinc-100 transition-colors">
                <FileText className="h-5 w-5 text-zinc-600" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 truncate pr-4 text-sm leading-tight group-hover:text-zinc-700 transition-colors">
                  {project.title}
                </h3>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Edited {formatDistanceToNow(project.lastModified, { addSuffix: true })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-zinc-400 hover:text-red-600 hover:bg-red-50 z-10 relative"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (confirm("Are you sure you want to delete this project?")) {
                    onDelete(project.id);
                  }
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="mt-auto pt-2 flex items-center justify-between gap-4">
            <span className={cn(
              "text-[10px] font-medium px-2 py-0.5 rounded-md border tracking-wide",
              statusColors[project.status || 'draft']
            )}>
              {project.status || 'Draft'}
            </span>
            
            <div className="flex items-center gap-2 flex-1 justify-end">
              <Progress value={project.progress || 0} className="h-1.5 w-20 bg-zinc-100" indicatorClassName="bg-zinc-900" />
              <span className="text-[10px] font-medium text-zinc-500 w-6 text-right">
                {project.progress || 0}%
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
