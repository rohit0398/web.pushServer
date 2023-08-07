import type { RankingInfo } from '@tanstack/match-sorter-utils';
import { rankItem } from '@tanstack/match-sorter-utils';
import type {
  Column,
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  Table,
} from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useState } from 'react';

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export type TableDataType = { [key: string]: any };

export function CustomTable({
  data,
  columns,
}: {
  data: TableDataType[];
  columns: ColumnDef<any>[];
}) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  React.useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'fullName') {
      if (table.getState().sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }]);
      }
    }
  }, [table.getState().columnFilters[0]?.id]);

  return (
    <div className="overflow-x-auto p-2">
      <table className=" min-w-full table-auto text-left text-sm font-semibold text-gray">
        <thead className=" sticky top-0 bg-stroke-light-gray">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="py-2 pl-2"
                  >
                    <div className="  flex border-r border-white">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}

                      {header.column.getCanFilter() ? (
                        <div className=" flex">
                          <Filter column={header.column} table={table} />
                        </div>
                      ) : null}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id} className=" py-2 pl-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Filter({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
}) {
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);

  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()],
  );

  return (
    <div className=" relative">
      <span
        className=" ml-1 cursor-pointer"
        onClick={() => setShowFilterDropdown((prev) => !prev)}
      >
        🔍
      </span>
      <div className={showFilterDropdown ? 'visible' : 'hidden'}>
        <datalist id={`${column.id}list`}>
          {sortedUniqueValues.slice(0, 50).map((value: any) => (
            <option value={value} key={value} />
          ))}
        </datalist>
        <DebouncedInput
          type="text"
          value={(columnFilterValue ?? '') as string}
          onChange={(value) => column.setFilterValue(value)}
          placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
          className="absolute left-0 top-full z-10 border border-light-gray bg-white p-2"
          list={`${column.id}list`}
        />
      </div>
    </div>
  );
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
