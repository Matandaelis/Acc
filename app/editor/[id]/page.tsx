"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProjects } from "@/hooks/use-projects";
import { useAI } from "@/hooks/use-ai";
import { OutlineSidebar } from "@/components/editor/outline-sidebar";
import { AISidebar } from "@/components/editor/ai-sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, Quote, ShieldCheck, Download, FileText } from "lucide-react";
import Link from "next/link";
import { Project, OutlineItem } from "@/lib/types";
import { GoogleGenAI, Type } from "@google/genai";
import { v4 as uuidv4 } from "uuid";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CitationGenerator } from "@/components/citation-generator";
import { PlagiarismChecker } from "@/components/plagiarism-checker";
import { Toaster } from "@/components/ui/sonner";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { TiptapEditor } from "@/components/editor/tiptap-editor";

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const { getProject, updateProject, loading } = useProjects();
  const { messages, sendMessage, isGenerating } = useAI();
  
  const [project, setProject] = useState<Project | undefined>(undefined);
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [exportFormat, setExportFormat] = useState("pdf");

  // Load project
  useEffect(() => {
    if (!loading && params.id) {
      const p = getProject(params.id as string);
      if (p) {
        setProject(p);
        setContent(p.content);
      } else {
        // Redirect if not found
        router.push("/");
      }
    }
  }, [loading, params.id, getProject, router]);

  const handleSave = () => {
    if (!project) return;
    setIsSaving(true);
    updateProject(project.id, { content, outline: project.outline });
    setTimeout(() => setIsSaving(false), 500); // Fake delay for feedback
  };

  const handleSendMessage = (text: string, isResearch: boolean) => {
    let prompt = text;
    let systemInstruction = `You are a helpful academic research assistant helping a student write their ${project?.type || 'thesis'}. Context: Title: "${project?.title}", Description: "${project?.description}". Current Content: "${content.substring(0, 1000)}..."`;

    if (isResearch) {
      prompt = `RESEARCH REQUEST: ${text}\n\nPlease search for academic papers, journals, and credible sources regarding this topic. Prioritize sources like PubMed, IEEE Xplore, and JSTOR where available via Google Search. \n\nOutput Format:\n1. **Key Findings**: Concise summaries of relevant papers.\n2. **Sources**: List the papers/articles found.\n3. **Research Gaps**: Identify areas needing further research.`;
      systemInstruction += " You have access to Google Search. Use it to find academic sources. Always cite your sources.";
    }

    sendMessage(prompt, systemInstruction, isResearch);
  };

  const handleGenerateOutline = async () => {
    if (!project) return;
    setIsGeneratingOutline(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key not found");

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a detailed academic outline for a ${project.type} titled "${project.title}". Description: "${project.description}". Return a list of chapters and sections.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                level: { type: Type.INTEGER, description: "1 for main chapters, 2 for sections, 3 for subsections" },
              },
              required: ["title", "level"],
            },
          },
        },
      });

      const rawOutline = JSON.parse(response.text || "[]");
      const newOutline: OutlineItem[] = rawOutline.map((item: any) => ({
        id: uuidv4(),
        title: item.title,
        level: item.level,
      }));

      setProject({ ...project, outline: newOutline });
      updateProject(project.id, { outline: newOutline });
    } catch (error) {
      console.error("Failed to generate outline", error);
      alert("Failed to generate outline. Please try again.");
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  const handleUpdateOutline = (newOutline: OutlineItem[]) => {
    if (!project) return;
    setProject({ ...project, outline: newOutline });
    updateProject(project.id, { outline: newOutline });
  };

  const handleExport = () => {
    toast.success(`Exporting as ${exportFormat.toUpperCase()}...`);
    // Simulate export
    setTimeout(() => {
      toast.success("Export complete! Download started.");
    }, 1500);
  };

  const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;
  const readingTime = Math.ceil(wordCount / 200);

  if (loading || !project) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#fcfcfc] overflow-hidden">
      <Toaster />
      {/* Header */}
      <header className="h-14 border-b border-zinc-200 flex items-center justify-between px-4 bg-white z-20">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-sm font-semibold text-zinc-900 truncate max-w-[200px] md:max-w-md tracking-tight">
              {project.title}
            </h1>
            <p className="text-[11px] text-zinc-500 font-medium">
              {isSaving ? "Saving..." : "Saved locally"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden md:flex text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 h-8 text-xs font-medium">
                <Quote className="h-3.5 w-3.5 mr-1.5" />
                Citations
              </Button>
            </DialogTrigger>
            <DialogContent>
              <CitationGenerator />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden md:flex text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 h-8 text-xs font-medium">
                <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                Check Plagiarism
              </Button>
            </DialogTrigger>
            <DialogContent>
              <PlagiarismChecker />
            </DialogContent>
          </Dialog>

          <div className="h-4 w-px bg-zinc-200 mx-2" />

          <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving} className="h-8 text-xs font-medium border-zinc-200 shadow-sm">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm h-8 text-xs font-medium px-3">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Document</DialogTitle>
                <DialogDescription>Choose a format to download your work.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document (.pdf)</SelectItem>
                      <SelectItem value="docx">Word Document (.docx)</SelectItem>
                      <SelectItem value="latex">LaTeX Source (.tex)</SelectItem>
                      <SelectItem value="markdown">Markdown (.md)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleExport} className="bg-zinc-900 hover:bg-zinc-800 text-white">Download</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Outline */}
        <div className="hidden md:block h-full border-r border-zinc-200 bg-zinc-50/50">
           <OutlineSidebar 
             outline={project.outline || []} 
             onUpdateOutline={handleUpdateOutline}
             onGenerateOutline={handleGenerateOutline}
           />
        </div>

        {/* Center: Editor */}
        <main className="flex-1 overflow-y-auto bg-[#fcfcfc] p-8 md:p-12 flex justify-center relative">
          <div className="w-full max-w-3xl bg-white shadow-sm border border-zinc-200 min-h-[calc(100vh-8rem)] p-12 rounded-xl relative mb-12">
            {isGeneratingOutline && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 backdrop-blur-sm rounded-xl">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-zinc-900 mb-2" />
                  <p className="text-sm font-medium text-zinc-600">Generating outline...</p>
                </div>
              </div>
            )}
            <TiptapEditor
              key={project?.id}
              content={content}
              onChange={(newContent) => setContent(newContent)}
            />
          </div>
          
          {/* Stats Footer */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur border border-zinc-200 shadow-sm rounded-full px-4 py-1.5 text-[11px] font-medium text-zinc-500 flex items-center space-x-4">
            <span>{wordCount} words</span>
            <span className="w-px h-3 bg-zinc-200" />
            <span>{readingTime} min read</span>
          </div>
        </main>

        {/* Right Sidebar: AI */}
        <div className="hidden lg:block h-full border-l border-zinc-200">
          <AISidebar
            messages={messages}
            onSendMessage={handleSendMessage}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </div>
  );
}
