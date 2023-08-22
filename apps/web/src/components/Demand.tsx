"use client";

import * as React from "react";
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
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Eye, MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import Navbar from "@/components/Navbar";
import usePagination from "./Pagination";
import { RouterOutputs, api } from "@/lib/trpc";
import { useEffect, useState } from "react";

function applyHighlightsToOriginal(original: string, snippets: string[]) {
  let result = original;
  snippets.forEach((snippet) => {
    const cleanSnippet = snippet
      .replace("[[HIGHLIGHT]]", "")
      .replace("[[/HIGHLIGHT]]", "");
    result = result.replace(cleanSnippet, snippet);
  });
  return result;
}

function HighlightedText({ text }: { text: string }) {
  const segments = text.split(/\[\[HIGHLIGHT\]\]|\[\[\/HIGHLIGHT\]\]/);
  return (
    <span>
      {segments.map((segment, index) =>
        index % 2 === 1 ? (
          <strong className="bg-primary px-1 text-secondary" key={index}>
            {segment}
          </strong>
        ) : (
          segment
        )
      )}
    </span>
  );
}

type Project = RouterOutputs["demand"]["scroll"]["results"][0];

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "SR Number",
    header: "SR Number",
    cell: ({ row }) => <div>{row.getValue("SR Number")}</div>,
  },
  {
    accessorKey: "Reqisition Status",
    header: "Reqisition Status",
    cell: ({ row }) => {
      const value = row.getValue("Reqisition Status");
      let format;
      if (value === "Open") {
        format = (
          <div className="text-right font-medium text-green-500">
            {row.getValue("Reqisition Status")}
          </div>
        );
      } else {
        format = (
          <div className="text-right font-medium text-red-500">
            {row.getValue("Reqisition Status")}
          </div>
        );
      }
      return format;
    },
  },
  {
    accessorKey: "Primary Skill",
    header: "Primary Skill",
    cell: ({ row }) => <div>{row.getValue("Primary Skill")}</div>,
  },
  {
    accessorKey: "Country",
    header: "Country",
    cell: ({ row }) => <div>{row.getValue("Country")}</div>,
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => (
      <div>
        {row.getValue("score").toLocaleString("en-US", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })}
      </div>
    ),
  },
  {
    accessorKey: "Job Description",
    header: "Job Description",
    cell: ({ row }) => {
      row.original;
      const highlights = row.original["highlights"] as Record<string, string[]>;
      const snippetsJD = highlights ? highlights["Job Description"] ?? [] : [];
      const snippetsPS = highlights ? highlights["Primary Skill"] ?? [] : [];
      console.log("snippetsJD: ", snippetsJD);
      console.log("snippetsPS: ", snippetsPS);
      return (
        <div className="flex flex-row justify-center items-center">
          <Dialog>
            <DialogTrigger>
              <Eye />
            </DialogTrigger>
            <DialogContent className="sm:min-w-[800px]">
              <DialogHeader>
                <DialogTitle>
                  <HighlightedText
                    text={applyHighlightsToOriginal(
                      row.getValue("Primary Skill"),
                      snippetsPS
                    )}
                  ></HighlightedText>
                </DialogTitle>
                <DialogDescription>
                  <HighlightedText
                    text={applyHighlightsToOriginal(
                      row.getValue("Job Description"),
                      snippetsJD
                    )}
                  ></HighlightedText>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
  //   {
  //     accessorKey: "Job Description",
  //     header: "Job Description",
  //     cell: ({ row }) => <div>{row.getValue("Job Description")}</div>,
  //   },
  //   {
  //     id: "actions",
  //     enableHiding: false,
  //     cell: ({ row }) => {
  //       const payment = row.original;

  //       return (
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <Button variant="ghost" className="h-8 w-8 p-0">
  //               <span className="sr-only">Open menu</span>
  //               <MoreHorizontal className="h-4 w-4" />
  //             </Button>
  //           </DropdownMenuTrigger>
  //           <DropdownMenuContent align="end">
  //             <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //             <DropdownMenuItem
  //               onClick={() => navigator.clipboard.writeText(payment.id)}
  //             >
  //               Copy payment ID
  //             </DropdownMenuItem>
  //             <DropdownMenuSeparator />
  //             <DropdownMenuItem>View customer</DropdownMenuItem>
  //             <DropdownMenuItem>View payment details</DropdownMenuItem>
  //           </DropdownMenuContent>
  //         </DropdownMenu>
  //       );
  //     },
  //   },
];
export default function Demand({ skills }: { skills: string }) {
  const [totalRows, setTotalRows] = useState(0);
  const { currentPage, onNextPage, onPrevPage, canGoBack, canGoNext } =
    usePagination({
      totalRows,
      rowsPerPage: 10,
    });

  const { data, refetch } = api.demand.scroll.useQuery(
    {
      size: 10,
      from: currentPage * 10 - 10,
      skills: skills,
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );
  const documents = data?.results || [];
  useEffect(() => {
    if (data) {
      console.log("total: ", data?.total);
      setTotalRows(data?.total || 0);
    }
  }, [data]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  //   const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: documents,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    // onRowSelectionChange: setSelected,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      //   rowSelection: selected,
    },
  });
  return (
    <div className="">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  //   data-state={row.getIsSelected() && "selected"}
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
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center w-full space-x-2 py-4">
        <div className="flex flex-row w-full justify-between">
          <p className="text-sm px-4">
            Page {currentPage} of {Math.ceil(totalRows / 10)}
          </p>

          <div className="flex flex-row gap-4">
            <Button
              // variant="outline"
              size="sm"
              onClick={() => onPrevPage()}
              disabled={!canGoBack}
            >
              Previous
            </Button>
            <Button
              // variant="outline"
              size="sm"
              onClick={() => onNextPage()}
              disabled={!canGoNext}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
