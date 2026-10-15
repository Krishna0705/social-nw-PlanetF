import { WAREHOUSES, available, ageInDays, formatNumber, formatUSD } from '../../data/inventoryData'

// Shows the summary numbers at the top of the dashboard.
// `lots` is passed in as a prop, so the cards update when the filters change.
export default function KpiCards({ lots, today }) {
  const availablePcs = lots.reduce((sum, lot) => sum + available(lot), 0)
  const reservedPcs = lots.reduce((sum, lot) => sum + lot.allocated, 0)
  const stockValue = lots.reduce((sum, lot) => sum + available(lot) * lot.unitPrice, 0)
  const ageingLots = lots.filter((lot) => available(lot) > 0 && ageInDays(lot.inward, today) > 60).length

  // Storage estimate = pieces still in the warehouse × storage rate (cents) of that warehouse.
  const storageCost = lots.reduce((sum, lot) => {
    const rate = WAREHOUSES.find((w) => w.id === lot.warehouse)?.storageCents ?? 0
    return sum + (available(lot) + lot.allocated) * rate / 100
  }, 0)

  const cards = [
    { label: 'Available stock', value: `${formatNumber(availablePcs)} pcs`, hint: `${lots.length} lots` },
    { label: 'Reserved', value: `${formatNumber(reservedPcs)} pcs`, hint: 'On pending buyer invoices' },
    { label: 'Stock value', value: formatUSD(stockValue), hint: 'At factory price' },
    { label: 'Ageing 60+ days', value: ageingLots, hint: ageingLots ? 'Lots to push to buyers' : 'Nothing ageing', alert: ageingLots > 0 },
    { label: 'Storage this month', value: formatUSD(storageCost), hint: 'Estimate · final after month-end' },
  ]

  return (
    <div className="inv-kpis">
      {cards.map((card) => (
        <div key={card.label} className={`inv-card inv-kpi ${card.alert ? 'is-alert' : ''}`}>
          <div className="inv-label">{card.label}</div>
          <div className="inv-kpi-value">{card.value}</div>
          <div className="inv-kpi-hint">{card.hint}</div>
        </div>
      ))}
    </div>
  )
}