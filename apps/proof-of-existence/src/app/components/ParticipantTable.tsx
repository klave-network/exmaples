import { useState, useMemo, FC, useRef } from 'react';
import { useVirtual } from 'react-virtual'
import { IoMdArrowDropup, IoMdArrowDropdown, IoMdArrowDropright } from 'react-icons/io';
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, getFilteredRowModel, ColumnFiltersState, FilterFn, useReactTable, Row } from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import { getSelfId, Participant } from '../utils/apiFunctions';

const fuzzyFilter: FilterFn<Participant> = (row, columnId, value, addMeta) => {

    const itemRank = rankItem(row.getValue(columnId), value)

    addMeta({
        itemRank
    })

    return itemRank.passed
}

type ParticipantTableProps = {
    participants: Participant[];
}

export const ParticipantTable: FC<ParticipantTableProps> = ({ participants }) => {

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')

    const columns = useMemo<ColumnDef<Participant>[]>(
        () => [
            {
                accessorKey: 'id',
                header: () => <span>Identifier</span>,
                cell: info => {
                    const id = info.getValue() as string;
                    return <>
                        <span className='font-mono text-xs text-slate-400'>{id}</span><br />
                        {getSelfId() === id ? <i>That's me!</i> : null}
                    </>
                }
            },
            // {
            //     id: 'name',
            //     header: () => <span>Name</span>,
            // },
            {
                accessorKey: 'contribution',
                header: () => <span>Last detection amount</span>,
                // cell: info => info.getValue() ? 'Oui' : 'Non'
            }
        ],
        []
    )

    const table = useReactTable({
        data: participants,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: fuzzyFilter
    })

    const tableContainerRef = useRef<HTMLDivElement>(null)
    const { rows } = table.getRowModel()
    const rowVirtualizer = useVirtual({
        parentRef: tableContainerRef,
        size: rows.length
    })
    const { virtualItems: virtualRows, totalSize } = rowVirtualizer
    const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0
    const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0

    return <div className='flex-grow flex flex-col min-h-0'>
        <div className='flex-grow mt-2 overflow-auto relative' ref={tableContainerRef}>
            {participants.length === 0
                ? <div className='w-full h-full absolute top-0 left-0 text-center align-middle m-auto p-16'>
                    <i className='text-slate-300'>No participant records</i>
                </div>
                : null}
            <table className="w-full text-sm">
                <thead>
                    {table.getHeaderGroups().map(headerGroup =>
                        <tr key={headerGroup.id} className="drop-shadow-xl">
                            {headerGroup.headers.map(header =>
                                <th key={header.id} colSpan={header.colSpan} className={`${['settled', 'settlement_timestamp', 'action'].includes(header.id) ? 'print:hidden' : ''} bg-slate-50 py-2 text-left sticky top-0 px-3 first-of-type:pl-0 last-of-type:pr-0 whitespace-nowrap`}>
                                    {header.isPlaceholder ? null : <div {...{
                                        className: header.column.getCanSort()
                                            ? 'cursor-pointer select-none'
                                            : '',
                                        onClick: header.column.getToggleSortingHandler(),
                                    }}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {{
                                            asc: <IoMdArrowDropup className="inline-block" />,
                                            desc: <IoMdArrowDropdown className="inline-block" />,
                                        }[header.column.getIsSorted() as string] ?? <IoMdArrowDropright className="inline-block opacity-0" />}
                                    </div>}
                                </th>)
                            }
                        </tr>
                    )}
                </thead>
                <tbody>
                    {paddingTop > 0 && (
                        <tr>
                            <td style={{ height: `${paddingTop}px` }} />
                        </tr>
                    )}
                    {virtualRows.map(virtualRow => {
                        const row = rows[virtualRow.index] as Row<Participant>
                        return <tr key={row.id} className="hover:bg-slate-100 border-t border-t-slate-200">
                            {row.getVisibleCells().map(cell => {
                                return (
                                    <td key={cell.id} className={`py-2 px-3 first-of-type:pl-0 last-of-type:pr-0 ${['settled', 'settlement_timestamp', 'action'].includes(cell.getContext().column.id) ? 'print:hidden' : ''} ${['settled', 'action'].includes(cell.column.id) ? 'align-middle' : 'align-top'}`}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                )
                            })}
                        </tr>
                    })}
                    {paddingBottom > 0 && (
                        <tr>
                            <td style={{ height: `${paddingBottom}px` }} />
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
}

export default ParticipantTable;