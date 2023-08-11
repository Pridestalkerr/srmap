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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

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
import { cn } from "@/lib/utils";
import usePagination from "./Pagination";
import { RouterOutputs, api } from "@/lib/trpc";
import { useState, useEffect } from "react";

type Employee = RouterOutputs["ras"]["scroll"]["results"][0];

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "Employee Code",
    header: "Employee Code",
    cell: ({ row }) => <div>{row.getValue("Employee Code")}</div>,
  },
  {
    accessorKey: "Employee Name",
    header: "Employee Name",
    cell: ({ row }) => <div>{row.getValue("Employee Name")}</div>,
  },
  {
    accessorKey: "Skill",
    header: () => <div className="text-right">Skill</div>,
    cell: ({ row }) => {
      const value = row.getValue("Skill");
      let format;
      if (value === "NA") {
        format = (
          <div className="text-right font-medium text-red-500">
            {row.getValue("Skill")}
          </div>
        );
      } else {
        format = (
          <div className="text-right font-medium">{row.getValue("Skill")}</div>
        );
      }
      return format;
    },
  },
  {
    accessorKey: "RAS Status Group",
    header: () => <div className="text-right">RAS Status Group</div>,
    cell: ({ row }) => {
      const value = row.getValue("RAS Status Group");
      let format;
      if (value === "Bench - AFD" || value === "Bench - Unproductive") {
        format = (
          <div className="text-right font-medium text-red-500">
            {row.getValue("RAS Status Group")}
          </div>
        );
      } else {
        format = (
          <div className="text-right font-medium">
            {row.getValue("RAS Status Group")}
          </div>
        );
      }
      return format;
    },
  },
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
export default function Ras({
  selected,
  setSelected,
}: {
  selected: { [key: string]: any };
  setSelected: React.Dispatch<React.SetStateAction<{}>>;
}) {
  const [totalRows, setTotalRows] = useState(0);
  const { currentPage, onNextPage, onPrevPage, canGoBack, canGoNext } =
    usePagination({
      totalRows,
      rowsPerPage: 10,
    });

  const { data, refetch } = api.ras.scroll.useQuery(
    {
      size: 10,
      from: currentPage * 10 - 10,
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
    <div>
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
                  onClick={() => {
                    setSelected(row.original);
                  }}
                  className={cn({
                    "bg-primary": selected === row.original,
                    // "border border-primary": selected === row.original,
                    "hover:bg-primary": selected === row.original,
                  })}
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
