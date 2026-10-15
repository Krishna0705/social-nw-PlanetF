import { Fragment } from 'react'
import {
  available, ageInDays, lotStatus, warehouseName,
  formatNumber, formatUSD, formatDate,
} from '../../data/inventoryData'

// The table of lots. Clicking a row expands a small detail panel underneath it.
export default function LotTable({ lots, today, openLot, onToggleLot }) {
  if (lots.length === 0) {
    return <div className="inv-empty">No lots match these filters.</div>
  }

  return (
    <div className="inv-table-wrap">
      <table className="inv-table">
        <thead>
          <tr>
            <th>Lot</th>
            <th>SKU / Style</th>
            <th>Buyer</th>
            <th>Source order</th>
            <th>Warehouse</th>
            <th>Inward</th>
            <th className="r">Age</th>
            <th className="r">Received</th>
            <th className="r">Reserved</th>
            <th className="r">Available</th>
            <th>Usage</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {lots.map((lot) => {
            const free = available(lot)
            const used = Math.round(((lot.received - free) / lot.received) * 100)
            const status = lotStatus(lot, today)
            const isOpen = openLot === lot.lot

            return (
              <Fragment key={lot.lot}>
                <tr
                  className={`inv-row ${isOpen ? 'is-open' : ''}`}
                  onClick={() => onToggleLot(lot.lot)}
                  aria-expanded={isOpen}
                >
                  <td><b>{lot.lot}</b></td>
                  <td>
                    <div className="inv-link">{lot.sku}</div>
                    <div className="inv-sub">{lot.style}</div>
                  </td>
                  <td>{lot.buyer}</td>
                  <td>{lot.order}</td>
                  <td>{warehouseName(lot.warehouse)}</td>
                  <td>{formatDate(lot.inward)}</td>
                  <td className="r">{ageInDays(lot.inward, today)} d</td>
                  <td className="r">{formatNumber(lot.received)}</td>
                  <td className="r">{formatNumber(lot.allocated)}</td>
                  <td className="r"><b>{formatNumber(free)}</b></td>
                  <td>
                    <div className="inv-bar" title={`${used}% used`}>
                      <i style={{ width: `${used}%` }} />
                    </div>
                  </td>
                  <td><span className={`inv-pill tone-${status.tone}`}>{status.label}</span></td>
                </tr>

                {isOpen && (
                  <tr className="inv-detail">
                    <td colSpan={12}>
                      <div className="inv-detail-grid">
                        <div><div className="inv-label">Unit cost</div>{formatUSD(lot.unitPrice)}</div>
                        <div><div className="inv-label">Available value</div>{formatUSD(free * lot.unitPrice)}</div>
                        <div><div className="inv-label">Shipped</div>{formatNumber(lot.shipped)} pcs</div>
                        <div><div className="inv-label">Ledger</div>
                          Move-in {formatNumber(lot.received)}
                          {lot.allocated > 0 && ` · reserved ${formatNumber(lot.allocated)}`}
                          {lot.shipped > 0 && ` · move-out ${formatNumber(lot.shipped)}`}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}