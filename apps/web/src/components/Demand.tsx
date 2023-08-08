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
import usePagination from "./Pagination";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
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
  const [data, setData] = React.useState<Payment[]>([]);
  const [totalRows, setTotalRows] = React.useState(0);
  const {
    currentPage,
    onNextPage,
    onPrevPage,
    canGoBack,
    canGoNext,
    setCurrentPage,
  } = usePagination({
    totalRows,
    rowsPerPage: 10,
  });
  React.useEffect(() => {
    axios
      .get("http://192.168.1.128:3333/demand", {
        params: {
          skills: skills,
          size: 10,
          from: currentPage * 10 - 10,
        },
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data.documents);
        setData(res.data.documents);
        setTotalRows(res.data.total);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [skills, currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [skills, setCurrentPage]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
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
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    alert(row.original["Job Description"]);
                  }}
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPrevPage()}
            disabled={!canGoBack}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNextPage()}
            disabled={!canGoNext}
          >
            Next
          </Button>
          Page {currentPage} of {Math.ceil(totalRows / 10)}
        </div>
      </div>
    </div>
  );
}
