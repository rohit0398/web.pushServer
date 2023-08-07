import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  Column,
  ColumnFiltersState,
  FilterFn,
  getFacetedUniqueValues,
  getFacetedRowModel,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { rankItem, compareItems } from "@tanstack/match-sorter-utils";
import { debounce } from "lodash";

export type tableDataType = { [key: string]: any };

export function Table({
  data,
  columns,
  handleRowClick,
}: {
  data: tableDataType[];
  columns: Column<tableDataType>[];
  handleRowClick?: (obj: tableDataType) => void;
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Custom fuzzy filter function
  const fuzzyFilter: FilterFn<tableDataType> = (
    row,
    columnId,
    value,
    addMeta
  ) => {
    console.log("Filter Called:", row, columnId, value);
    // Rank the item using fuzzy search
    const itemRank = rankItem(row[columnId], value);

    // Store the itemRank info
    addMeta({
      itemRank,
    });

    // Return if the item should be filtered in/out
    return itemRank.passed;
  };

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      includesString: (row, columnId, filterValue, addMeta) => {
        console.log("filter");
        const cellValue = row[columnId]?.toString().toLowerCase();
        const searchValue = filterValue.toLowerCase();
        const passed = cellValue.includes(searchValue);
        return passed;
      },
    },
    // state: {
    //   columnFilters,
    // },
    getCoreRowModel: getCoreRowModel(),
    // onColumnFiltersChange: setColumnFilters,
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedRowModel: getFacetedRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    enableColumnFilters: true,
  });

  return (
    <div className="p-2 overflow-x-auto">
      <table className="table-auto min-w-full text-left text-sm text-gray font-semibold">
        <thead className=" bg-stroke-light-gray sticky top-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="py-2 pl-2">
                  <div className=" flex border-r border-white">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {header.column.getCanFilter() ? ( // Check if the column can be filtered
                      <Filter
                        column={header.column}
                        table={table}
                        headerId={header.id}
                      />
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} onClick={() => handleRowClick?.(row.original)}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className=" py-2 pl-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Filter({
  column,
  table,
  headerId,
}: {
  column: Column<any, unknown>;
  table: any;
  headerId: any;
}) {
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
  const [activeFilterHeader, setActiveFilterHeader] = useState<string>("");
  const [value, setValue] = useState("");

  const handleFilterIconClick = (headerId: string) => {
    setShowFilterDropdown((prev) => !prev);
    setActiveFilterHeader(headerId);
  };

  const updateColumnFilter = useCallback(
    debounce(
      function (value) {
        column.setFilterValue(value);
      },
      500,
      { maxWait: 4000 }
    ),
    []
  );

  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );

  // console.log('ab', firstValue)
  console.log("cd", columnFilterValue);
  // console.log('ef', sortedUniqueValues)
  // console.log('headid', column.getFacetedUniqueValues().keys())

  return (
    <div className="relative">
      <span
        className=" cursor-pointer ml-1"
        onClick={() => handleFilterIconClick(headerId)}
      >
        🔍
      </span>
      {showFilterDropdown && activeFilterHeader === headerId ? ( // Show the filter dropdown if active header matches
        <div className=" absolute top-full left-0 z-10 p-2 bg-white border border-light-gray">
          <input
            type="text"
            placeholder={`Search... (${column.id})`}
            value={value ?? columnFilterValue ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              setValue(value);
              updateColumnFilter(value);
            }}
            list={column.id + "list"}
          />
          {/* <datalist id={column.id + "list"}>
            {sortedUniqueValues.slice(0, 5000).map((value: any) => (
              <option value={value} key={value} />
            ))}
          </datalist> */}
        </div>
      ) : null}
    </div>
  );
}
