import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Chapter, VerseMetadata } from "../../model/Chapter"
import { DialogTrigger } from "@/components/ui/dialog"



export function createChapterColumns(onShowDialog: (chapter: Chapter) => void): ColumnDef<Chapter, any[]>[] { 
  return [ 
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => (
        
        <div className="capitalize">{row.getValue("status")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Chapter
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "unsupportedTags",
      header: () => <div className="text-right">Unsupported</div>,
      cell: ({ row }) => {
        return <div className="text-right font-medium">{row.getValue("unsupportedTags")}</div>
      },
    },
    {
      accessorKey: "tags",
      header: () => <div className="text-right">Tags</div>,
      cell: ({ row }) => {
        return <div className="text-right font-medium">{row.getValue("tags")}</div>
      },
    },  
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const chapter = row.original
  
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(chapter.tags)}
              >
                Copy tags
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(chapter.unsupportedTags)}
              >
                Copy unsupported tags
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                    <DropdownMenuItem onClick={() => {
                      onShowDialog(chapter)
                    }}>View chapter details</DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
  
}

export function createChapterComboColumns(type: "Book" | "Version", onShowDialog: (chapter: Chapter) => void): ColumnDef<Chapter, any[]>[] { 
  return [ 
    {
      accessorKey: "status",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => (
        
        <div className="capitalize">{row.getValue("status")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: () => <div className="text-center">{type}</div>,
      cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "unsupportedTags",
      header: () => <div className="text-right">Unsupported</div>,
      cell: ({ row }) => {
        return <div className="text-right font-medium">{row.getValue("unsupportedTags")}</div>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const chapter = row.original
  
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(chapter.unsupportedTags)}
              >
                Copy unsupported tags
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                    <DropdownMenuItem onClick={() => {
                      onShowDialog(chapter)
                    }}>View {type.toLowerCase()} details</DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
  
}
export function createVerseColumns(): ColumnDef<VerseMetadata, any[]>[] {
  return [
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("status")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Chapter
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "unsupportedTags",
      header: () => <div className="text-right">Unsupported</div>,
      cell: ({ row }) => {
        return <div className="text-right font-medium">{row.getValue("unsupportedTags")}</div>
      },
    },
    {
      accessorKey: "tags",
      header: () => <div className="text-right">Tags</div>,
      cell: ({ row }) => {
        return <div className="text-right font-medium">{row.getValue("tags")}</div>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const verse = row.original
  
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(verse.tags)}
              >
                Copy tags
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(verse.unsupportedTags)}
              >
                Copy unsupported tags
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}