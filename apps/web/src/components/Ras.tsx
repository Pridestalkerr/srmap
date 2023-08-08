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

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
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
  const [totalRows, setTotalRows] = React.useState(0);
  const { currentPage, onNextPage, onPrevPage, canGoBack, canGoNext } =
    usePagination({
      totalRows,
      rowsPerPage: 10,
    });
  const [data, setData] = React.useState<Payment[]>([]);
  React.useEffect(() => {
    axios
      .get("http://192.168.1.128:3333/ras", {
        params: {
          size: 10,
          from: currentPage * 10 - 10,
        },
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        setData(res.data.documents);
        setTotalRows(res.data.total);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentPage]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  //   const [rowSelection, setRowSelection] = React.useState({});

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
                    "bg-green-500/40": selected === row.original,
                    // "border border-primary": selected === row.original,
                    "hover:bg-green-500/40": selected === row.original,
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
