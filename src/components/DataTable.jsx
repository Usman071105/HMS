import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Search, Filter, MoreHorizontal } from 'lucide-react';
import './DataTable.css';

export default function DataTable({
    data = [],
    columns = [],
    pageSize = 10,
    searchable = true,
    filterable = true,
    actions = null,
    onRowClick = null,
    loading = false,
    emptyMessage = 'No data available'
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);

    // Handle sorting
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Filter and sort data
    const processedData = useMemo(() => {
        let result = [...data];

        // Apply search filter
        if (searchTerm) {
            result = result.filter((row) =>
                columns.some((col) => {
                    const value = row[col.key];
                    return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
                })
            );
        }

        // Apply sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue === bValue) return 0;
                if (aValue === null || aValue === undefined) return 1;
                if (bValue === null || bValue === undefined) return -1;

                const comparison = aValue < bValue ? -1 : 1;
                return sortConfig.direction === 'asc' ? comparison : -comparison;
            });
        }

        return result;
    }, [data, columns, searchTerm, sortConfig]);

    // Pagination
    const totalPages = Math.ceil(processedData.length / pageSize);
    const paginatedData = processedData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handlePageChange = (page) => {
        setCurrentPage(Math.min(Math.max(1, page), totalPages));
    };

    // Render cell content
    const renderCell = (row, column) => {
        if (column.render) {
            return column.render(row[column.key], row);
        }
        return row[column.key];
    };

    return (
        <div className="data-table-container">
            {/* Table Toolbar */}
            {(searchable || filterable) && (
                <div className="table-toolbar">
                    {searchable && (
                        <div className="search-input">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    )}
                    {filterable && (
                        <button
                            className={`filter-btn ${filterOpen ? 'active' : ''}`}
                            onClick={() => setFilterOpen(!filterOpen)}
                        >
                            <Filter size={18} />
                            Filters
                        </button>
                    )}
                </div>
            )}

            {/* Table */}
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    onClick={() => column.sortable !== false && handleSort(column.key)}
                                    className={column.sortable !== false ? 'sortable' : ''}
                                    style={{ width: column.width }}
                                >
                                    <div className="th-content">
                                        <span>{column.label}</span>
                                        {column.sortable !== false && sortConfig.key === column.key && (
                                            <span className="sort-icon">
                                                {sortConfig.direction === 'asc' ? (
                                                    <ChevronUp size={16} />
                                                ) : (
                                                    <ChevronDown size={16} />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {actions && <th className="actions-header">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="loading-cell">
                                    <div className="loading-spinner"></div>
                                    <span>Loading...</span>
                                </td>
                            </tr>
                        ) : paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="empty-cell">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, rowIndex) => (
                                <tr
                                    key={row.id || rowIndex}
                                    onClick={() => onRowClick && onRowClick(row)}
                                    className={onRowClick ? 'clickable' : ''}
                                >
                                    {columns.map((column) => (
                                        <td key={column.key}>{renderCell(row, column)}</td>
                                    ))}
                                    {actions && (
                                        <td className="actions-cell">
                                            {typeof actions === 'function' ? actions(row) : actions}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="table-pagination">
                    <span className="pagination-info">
                        Showing {(currentPage - 1) * pageSize + 1} to{' '}
                        {Math.min(currentPage * pageSize, processedData.length)} of{' '}
                        {processedData.length} entries
                    </span>
                    <div className="pagination-controls">
                        <button
                            className="pagination-btn"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }
                            return (
                                <button
                                    key={pageNum}
                                    className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                                    onClick={() => handlePageChange(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        <button
                            className="pagination-btn"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Status Badge Component
export function StatusBadge({ status, variant }) {
    const variants = {
        success: 'badge-success',
        warning: 'badge-warning',
        error: 'badge-error',
        info: 'badge-info',
        default: 'badge-default'
    };

    return (
        <span className={`status-badge ${variants[variant] || variants.default}`}>
            {status}
        </span>
    );
}
