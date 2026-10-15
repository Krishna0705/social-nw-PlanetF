import { useMemo, useState } from 'react'
import { LOTS, available, ageInDays } from '../../data/inventoryData'
import KpiCards from './KpiCards'
import InventoryFilters from './InventoryFilters'
import LotTable from './LotTable'
import './inventory.css'

// Fixed once when the page loads, used to work out stock age.
const today = new Date()

// The page component. It owns the state (filters + which row is open)
// and passes data down to the smaller components as props.
export default function InventoryDashboard() {
  // --- state: each useState is one piece of data React remembers ---
  const [warehouse, setWarehouse] = useState('')   // '' means all warehouses
  const [ageing, setAgeing] = useState('')         // '', '0-30', '31-60', '60+'
  const [search, setSearch] = useState('')
  const [hideEmpty, setHideEmpty] = useState(false)
  const [openLot, setOpenLot] = useState(null)

  // --- derived data: recalculated whenever a filter changes ---
  const visibleLots = useMemo(() => {
    const q = search.trim().toLowerCase()

    return LOTS
      .filter((lot) => warehouse === '' || lot.warehouse === warehouse)
      .filter((lot) => {
        const age = ageInDays(lot.inward, today)
        if (ageing === '0-30') return age <= 30
        if (ageing === '31-60') return age > 30 && age <= 60
        if (ageing === '60+') return age > 60
        return true
      })
      .filter((lot) => !hideEmpty || available(lot) > 0)
      .filter((lot) =>
        q === '' ||
        [lot.lot, lot.sku, lot.style, String(lot.order), lot.buyer]
          .some((field) => field.toLowerCase().includes(q)),
      )
      // Oldest stock first: this is the FIFO order used when invoicing from inventory.
      .sort((a, b) => new Date(a.inward) - new Date(b.inward))
  }, [warehouse, ageing, search, hideEmpty])

  const toggleLot = (id) => setOpenLot((current) => (current === id ? null : id))

  return (
    <div className="inv">
      <header className="inv-head">
        <div>
          <h1 className="inv-title">Inventory Dasboard testing</h1>
          <p className="inv-sub">Stock held in warehouses, by lot. One lot = one approved purchase invoice.</p>
        </div>
        <div className="inv-actions">
          <button type="button" className="inv-btn soft">Download stock report</button>
          <button type="button" className="inv-btn">Raise invoice from inventory</button>
        </div>
      </header>

      <KpiCards lots={visibleLots} today={today} />

      <section className="inv-card inv-panel">
        <InventoryFilters
          allLots={LOTS}
          warehouse={warehouse} onWarehouseChange={setWarehouse}
          ageing={ageing} onAgeingChange={setAgeing}
          search={search} onSearchChange={setSearch}
        />
        <div className="inv-panel-bar">
          <span className="inv-sub">
            Showing {visibleLots.length} of {LOTS.length} lots · oldest first (FIFO)
          </span>
          <label className="inv-check">
            <input type="checkbox" checked={hideEmpty} onChange={(e) => setHideEmpty(e.target.checked)} />
            Hide fully used lots
          </label>
        </div>
        <LotTable lots={visibleLots} today={today} openLot={openLot} onToggleLot={toggleLot} />
      </section>
    </div>
  )
}