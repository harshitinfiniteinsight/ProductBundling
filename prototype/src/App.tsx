import { useState } from 'react';
import { CreateBundlePage } from './components/CreateBundlePage';
import { ManageBundlesPage } from './components/ManageBundlesPage';
import { createEmptyBundleDraft, mockBundles, mockProducts } from './data/mockData';
import { Bundle } from './types';

type PageMode = 'manage' | 'create' | 'edit' | 'view';
type StatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';
type TypeFilter = 'ALL' | 'BOGO' | 'BUNDLE';

export function App() {
  const [bundles, setBundles] = useState<Bundle[]>(mockBundles);
  const [mode, setMode] = useState<PageMode>('manage');
  const [draft, setDraft] = useState<Bundle>(createEmptyBundleDraft());

  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const goManage = () => {
    setMode('manage');
    setDraft(createEmptyBundleDraft());
  };

  const openCreate = () => {
    setDraft(createEmptyBundleDraft());
    setMode('create');
  };

  const openEdit = (bundle: Bundle) => {
    setDraft({ ...bundle });
    setMode('edit');
  };

  const openView = (bundle: Bundle) => {
    setDraft({ ...bundle });
    setMode('view');
  };

  const saveBundle = (activate: boolean) => {
    const payload: Bundle = {
      ...draft,
      status: activate ? true : draft.status,
      discountType: draft.type === 'BOGO' ? draft.bogoRule?.discountType ?? 'FREE' : draft.discountType,
      discountValue: draft.type === 'BOGO' ? draft.bogoRule?.discountValue ?? 100 : draft.discountValue,
    };

    if (mode === 'edit') {
      setBundles((prev) => prev.map((bundle) => (bundle.id === draft.id ? payload : bundle)));
    } else {
      const nextId = Math.max(...bundles.map((bundle) => bundle.id)) + 1;
      setBundles((prev) => [{ ...payload, id: nextId, createdAt: new Date().toISOString() }, ...prev]);
    }

    goManage();
  };

  const duplicateBundle = (bundle: Bundle) => {
    const nextId = Math.max(...bundles.map((item) => item.id)) + 1;
    const duplicate: Bundle = {
      ...bundle,
      id: nextId,
      name: `${bundle.name} (Copy)`,
      status: false,
      createdAt: new Date().toISOString(),
    };
    setBundles((prev) => [duplicate, ...prev]);
  };

  const archiveBundle = (bundle: Bundle) => {
    setBundles((prev) => prev.map((item) => (item.id === bundle.id ? { ...item, status: false } : item)));
  };

  const toggleStatus = (id: number, status: boolean) => {
    setBundles((prev) => prev.map((bundle) => (bundle.id === id ? { ...bundle, status } : bundle)));
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo">U</div>
        <nav>
          <button className="nav-btn active">🏠</button>
          <button className="nav-btn">⭐</button>
          <button className="nav-btn">📦</button>
          <button className="nav-btn">⚙</button>
        </nav>
      </aside>

      <main className="main-content">
        {mode === 'manage' ? (
          <ManageBundlesPage
            bundles={bundles}
            search={search}
            dateFilter={dateFilter}
            statusFilter={statusFilter}
            typeFilter={typeFilter}
            page={page}
            pageSize={pageSize}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            onDateFilterChange={(value) => {
              setDateFilter(value);
              setPage(1);
            }}
            onStatusFilterChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
            onTypeFilterChange={(value) => {
              setTypeFilter(value);
              setPage(1);
            }}
            onPageChange={setPage}
            onAdd={openCreate}
            onStatusToggle={toggleStatus}
            onView={openView}
            onEdit={openEdit}
            onDuplicate={duplicateBundle}
            onArchive={archiveBundle}
          />
        ) : (
          <CreateBundlePage
            mode={mode}
            draft={draft}
            products={mockProducts}
            onChange={setDraft}
            onBack={goManage}
            onCancel={goManage}
            onSaveDraft={() => saveBundle(false)}
            onSaveActivate={() => saveBundle(true)}
          />
        )}
      </main>
    </div>
  );
}
