import { Bundle } from '../types';

type StatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';
type TypeFilter = 'ALL' | 'BOGO' | 'BUNDLE';

interface ManageBundlesPageProps {
  bundles: Bundle[];
  search: string;
  dateFilter: string;
  statusFilter: StatusFilter;
  typeFilter: TypeFilter;
  page: number;
  pageSize: number;
  onSearchChange: (value: string) => void;
  onDateFilterChange: (value: string) => void;
  onStatusFilterChange: (value: StatusFilter) => void;
  onTypeFilterChange: (value: TypeFilter) => void;
  onPageChange: (value: number) => void;
  onAdd: () => void;
  onStatusToggle: (id: number, value: boolean) => void;
  onView: (bundle: Bundle) => void;
  onEdit: (bundle: Bundle) => void;
  onDuplicate: (bundle: Bundle) => void;
  onArchive: (bundle: Bundle) => void;
}

export function ManageBundlesPage({
  bundles,
  search,
  dateFilter,
  statusFilter,
  typeFilter,
  page,
  pageSize,
  onSearchChange,
  onDateFilterChange,
  onStatusFilterChange,
  onTypeFilterChange,
  onPageChange,
  onAdd,
  onStatusToggle,
  onView,
  onEdit,
  onDuplicate,
  onArchive,
}: ManageBundlesPageProps) {
  const filteredBundles = bundles.filter((bundle) => {
    const query = search.toLowerCase();
    const matchesSearch = bundle.name.toLowerCase().includes(query) || bundle.id.toString().includes(query);
    const matchesStatus =
      statusFilter === 'ALL' || (statusFilter === 'ACTIVE' ? bundle.status : !bundle.status);
    const matchesType = typeFilter === 'ALL' || bundle.type === typeFilter;
    const matchesDate = !dateFilter || bundle.createdAt.slice(0, 10) === dateFilter;

    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const totalPages = Math.max(1, Math.ceil(filteredBundles.length / pageSize));
  const paginatedBundles = filteredBundles.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <header className="topbar">
        <div>
          <p className="subtle-text">Manage Build & Buy Catcher</p>
          <h1>Manage Product Bundles</h1>
        </div>
        <div className="top-actions">
          <button type="button" className="primary-btn" onClick={onAdd}>
            + Add New Product Bundle
          </button>
        </div>
      </header>

      <section className="panel">
        <div className="filters-row">
          <input className="input" type="date" value={dateFilter} onChange={(e) => onDateFilterChange(e.target.value)} />
          <select className="input" value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value as StatusFilter)}>
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <select className="input" value={typeFilter} onChange={(e) => onTypeFilterChange(e.target.value as TypeFilter)}>
            <option value="ALL">All Types</option>
            <option value="BOGO">BOGO</option>
            <option value="BUNDLE">Product Bundle</option>
          </select>
          <input
            className="input"
            placeholder="Search by name or ID"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Bundle Name</th>
              <th>Bundle Type</th>
              <th>Discount</th>
              <th>Products Count</th>
              <th>Created On</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBundles.map((bundle) => (
              <tr key={bundle.id}>
                <td>{bundle.id}</td>
                <td>{bundle.name}</td>
                <td>{bundle.type === 'BOGO' ? 'BOGO' : 'Product Bundle'}</td>
                <td>{bundle.discountType === 'FREE' ? 'Free' : `${bundle.discountValue}${bundle.discountType === 'PERCENTAGE' ? '%' : ''}`}</td>
                <td>{bundle.type === 'BOGO' ? 2 : bundle.items.length}</td>
                <td>{new Date(bundle.createdAt).toLocaleString()}</td>
                <td>
                  <label className="switch">
                    <input type="checkbox" checked={bundle.status} onChange={(e) => onStatusToggle(bundle.id, e.target.checked)} />
                    <span className="slider" />
                  </label>
                </td>
                <td>
                  <div className="action-links">
                    <button className="link-btn" onClick={() => onView(bundle)} type="button">View</button>
                    <button className="link-btn" onClick={() => onEdit(bundle)} type="button">Edit</button>
                    <button className="link-btn" onClick={() => onDuplicate(bundle)} type="button">Duplicate</button>
                    <button className="link-btn danger" onClick={() => onArchive(bundle)} type="button">Archive</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination-row">
          <p className="subtle-text">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredBundles.length)} of {filteredBundles.length} entries
          </p>
          <div className="pagination">
            <button className="page-btn" type="button" disabled={page === 1} onClick={() => onPageChange(page - 1)}>‹</button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((index) => (
              <button key={index} className={`page-btn ${index === page ? 'active' : ''}`} type="button" onClick={() => onPageChange(index)}>
                {index}
              </button>
            ))}
            <button className="page-btn" type="button" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>›</button>
          </div>
        </div>
      </section>
    </>
  );
}