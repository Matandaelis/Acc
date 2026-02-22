"use client";

import { useState, useEffect } from "react";
import { useProjects } from "@/hooks/use-projects";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sidebar } from "@/components/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, BookOpen, Search, LayoutGrid, List, Menu, Filter } from "lucide-react";
import { Project } from "@/lib/types";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { projects, loading, addProject, deleteProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectType, setNewProjectType] = useState<Project["type"]>("thesis");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;
    addProject(newProjectTitle, newProjectDesc, newProjectType);
    setIsModalOpen(false);
    setNewProjectTitle("");
    setNewProjectDesc("");
    setNewProjectType("thesis");
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-[#fcfcfc]">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-zinc-200 flex items-center justify-between px-4 md:px-8 bg-white z-10">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-r-0">
                <SheetTitle className="hidden">Navigation Menu</SheetTitle>
                <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold text-zinc-900 md:hidden">ThesisAI</h1>
            
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input 
                placeholder="Search documents..." 
                className="w-64 pl-9 bg-zinc-50 border-zinc-200 focus-visible:ring-zinc-300 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
             <div className="h-8 w-8 rounded-full bg-zinc-900 flex items-center justify-center text-xs font-bold text-white shadow-sm">
              JD
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight">
                  Documents
                </h1>
                <p className="text-zinc-500 mt-1 text-sm">
                  Manage and organize your academic research and writing.
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm h-9 px-4">
                      <Plus className="h-4 w-4 mr-2" />
                      New Document
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create New Document</DialogTitle>
                      <DialogDescription>
                        Start a new thesis, dissertation, or research paper.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Document Title</Label>
                        <Input
                          id="title"
                          required
                          placeholder="e.g., The Impact of AI on Education"
                          value={newProjectTitle}
                          onChange={(e) => setNewProjectTitle(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select value={newProjectType} onValueChange={(v) => setNewProjectType(v as Project["type"])}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="thesis">Thesis</SelectItem>
                            <SelectItem value="dissertation">Dissertation</SelectItem>
                            <SelectItem value="paper">Research Paper</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="desc">Description (Optional)</Label>
                        <Textarea
                          id="desc"
                          placeholder="Brief summary of your research topic..."
                          className="min-h-[80px]"
                          value={newProjectDesc}
                          onChange={(e) => setNewProjectDesc(e.target.value)}
                        />
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-zinc-900 hover:bg-zinc-800 text-white">Create Document</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs font-medium text-zinc-600 border-zinc-200 bg-white shadow-sm">
                  <Filter className="h-3.5 w-3.5 mr-1.5" />
                  Filter
                </Button>
              </div>
              <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-md border border-zinc-200">
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  className={cn("h-7 w-7 p-0 rounded-sm", viewMode === "list" ? "bg-white shadow-sm" : "text-zinc-500 hover:text-zinc-900")}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  className={cn("h-7 w-7 p-0 rounded-sm", viewMode === "grid" ? "bg-white shadow-sm" : "text-zinc-500 hover:text-zinc-900")}
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Project List */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 rounded-xl bg-zinc-100 animate-pulse border border-zinc-200" />
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-zinc-300 rounded-xl bg-zinc-50/50">
                <div className="bg-white h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-200 shadow-sm">
                  <BookOpen className="h-5 w-5 text-zinc-400" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900">No documents found</h3>
                <p className="text-sm text-zinc-500 mt-1 max-w-sm mx-auto mb-6">
                  Get started by creating a new document for your research.
                </p>
                <Button onClick={() => setIsModalOpen(true)} className="bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm h-9 px-4">
                  <Plus className="h-4 w-4 mr-2" />
                  New Document
                </Button>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onDelete={deleteProject}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
