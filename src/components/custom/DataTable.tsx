"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { VersionSelector } from "./VersionSelector"
import { Dialog } from "./Dialog"
import { BibleVersionsQuery } from '../../graphql/__generated__/graphql';
import { useState } from "react"
import { Player } from '@lottiefiles/react-lottie-player';


interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T, any>[]
  versions?: BibleVersionsQuery | undefined
  filter?: "chapters" | "verses" | "books"
  showVersions?: boolean
  showSearch?: boolean
  showPaginator?: boolean
  showColumns?: boolean
}
export function DataTable<T>({ 
  data, 
  columns, 
  versions, 
  filter = "chapters",
  showVersions,
  showSearch,
  showPaginator,
  showColumns = true
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pageNumber, setPageNumber] = useState(1)

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <Dialog children={
      <div className="w-full">
        <div className="flex items-center pb-4">
          {showSearch && <Input
            placeholder={`Search for ${filter}...`}
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />}
          {showColumns && <div className="flex ml-auto space-x-2">
            {showVersions && <VersionSelector versions={versions} />}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Columns <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>}

        </div>
        <div className={`rounded-md border min-h-[530px]`}>
          <Table>
            <TableHeader className="text-center">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow className="" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    className=""
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="h-[400px]">
                  <TableCell
                    colSpan={columns.length}
                    className=" "
                  >
                    <span className="m-auto"><Player
                          autoplay={true}
                          loop={true}
                          speed={1}
                          src={"https://lottie.host/9462621b-0d70-4a37-aba4-6bc8a578d08e/OYJBWVy48Q.json"}
                          style={{ height: '150px', width: '40%', margin: 'auto' }}
                        ></Player></span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {showPaginator && <div className=" flex  py-4">
          <div className=" text-sm text-muted-foreground mr-auto">
            {pageNumber} of{" "}
            {table.getPageCount()} page(s).
          </div>
          <div className=" space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                table.previousPage()
                setPageNumber(pageNumber - 1)
              }}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                table.nextPage()
                setPageNumber(pageNumber + 1)
              }}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>}
      </div>
    } />
  )
}


