import { WAREHOUSES } from '../../data/inventoryData'

// The filter bar: warehouse chips, ageing dropdown and search box.
// This component doesn't keep its own state. It receives the current values
// and "onChange" functions from the parent (InventoryDashboard).
// This pattern is called "lifting state up".
export default function InventoryFilters({
  allLots,
  warehouse, onWarehouseChange,
  ageing, onAgeingChange,
  search, onSearchChange,
}) {
  const countFor = (id) => allLots.filter((lot) => id === '' || lot.warehouse === id).length
  const chips = [{ id: '', name: 'All warehouses' }, ...WAREHOUSES]

  return (
    <div className="inv-filters">
      <div className="inv-chips" role="group" aria-label="Warehouse">
        {chips.map((w) => (
          <button
            key={w.id || 'all'}
            type="button"
            className={`inv-chip ${warehouse === w.id ? 'is-on' : ''}`}
            onClick={() => onWarehouseChange(w.id)}
          >
            {w.name} <span className="inv-chip-count">{countFor(w.id)}</span>
          </button>
        ))}
      </div>

      <div className="inv-filter-right">
        <select
          className="inv-input"
          value={ageing}
          onChange={(e) => onAgeingChange(e.target.value)}
          aria-label="Ageing"
        >
          <option value="">All ageing</option>
          <option value="0-30">0–30 days</option>
          <option value="31-60">31–60 days</option>
          <option value="60+">60+ days</option>
        </select>
        <input
          className="inv-input inv-search"
          type="search"
          placeholder="Search SKU, style, order, lot"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  )
}