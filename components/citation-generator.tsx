"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Check } from "lucide-react"
import { toast } from "sonner"

export function CitationGenerator() {
  const [type, setType] = useState("website")
  const [style, setStyle] = useState("apa")
  const [url, setUrl] = useState("")
  const [author, setAuthor] = useState("")
  const [title, setTitle] = useState("")
  const [year, setYear] = useState("")
  const [generated, setGenerated] = useState("")

  const generateCitation = () => {
    let citation = ""
    const date = new Date().toLocaleDateString()
    
    if (style === "apa") {
      if (type === "website") {
        citation = `${author || "Author, A. A."} (${year || "n.d."}). ${title || "Title of work"}. Retrieved ${date}, from ${url || "URL"}`
      } else {
        citation = `${author || "Author, A. A."} (${year || "Year"}). ${title || "Title of work"}. Publisher.`
      }
    } else if (style === "mla") {
      if (type === "website") {
        citation = `${author || "Author, Last Name"}. "${title || "Title of Work"}." Website Name, ${year || "Date"}, ${url || "URL"}. Accessed ${date}.`
      } else {
        citation = `${author || "Author, Last Name"}. ${title || "Title of Work"}. Publisher, ${year || "Year"}.`
      }
    }
    
    setGenerated(citation)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generated)
    toast.success("Citation copied to clipboard")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Citation Generator</CardTitle>
        <CardDescription>Generate citations in APA, MLA, and Chicago styles.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Source Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="book">Book</SelectItem>
                <SelectItem value="journal">Journal Article</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Citation Style</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apa">APA 7</SelectItem>
                <SelectItem value="mla">MLA 9</SelectItem>
                <SelectItem value="chicago">Chicago</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>URL / DOI</Label>
          <Input placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Author</Label>
            <Input placeholder="Smith, John" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Year</Label>
            <Input placeholder="2024" value={year} onChange={(e) => setYear(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Title</Label>
          <Input placeholder="Article or Book Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <Button onClick={generateCitation} className="w-full">Generate Citation</Button>

        {generated && (
          <div className="p-4 bg-muted rounded-md relative group">
            <p className="font-mono text-sm pr-8">{generated}</p>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
