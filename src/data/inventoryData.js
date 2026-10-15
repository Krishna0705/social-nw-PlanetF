// Sample data for the Inventory dashboard.
// In the real portal this would come from a backend API (e.g. fetch('/api/inventory/lots')).
// Here it is hard-coded so you can practise the UI without a server.

// Warehouses. Storage rate is in US cents per piece per month.
export const WAREHOUSES = [
    { id: 'NJ', name: 'Edison, NJ', code: 'WH-NJ-01', storageCents: 4 },
    { id: 'LA', name: 'Los Angeles, CA', code: 'WH-LA-02', storageCents: 4 },
    { id: 'GGN', name: 'Gurugram, HR', code: 'WH-GGN-01', storageCents: 1 },
  ]
  
  // One lot = one approved purchase invoice.
  //   received  = pieces that came into the warehouse
  //   allocated = pieces reserved on a buyer invoice that finance hasn't approved yet
  //   shipped   = pieces that have already left the warehouse
  //   available = received - allocated - shipped  (calculated in helpers below)
  export const LOTS = [
    { lot: 'L-1012', sku: 'GM-2025-0061187', style: 'GT5874', buyer: 'G-III Apparel Group Ltd.', order: 55194, warehouse: 'NJ', inward: '2026-07-28', received: 600, allocated: 120, shipped: 0, unitPrice: 7.4 },
    { lot: 'L-1021', sku: 'GM-2025-0064422', style: 'GT6036', buyer: 'G-III Apparel Group Ltd.', order: 55360, warehouse: 'NJ', inward: '2026-08-14', received: 400, allocated: 0, shipped: 100, unitPrice: 7.09 },
    { lot: 'L-1029', sku: 'GM-2025-0061187', style: 'GT5874', buyer: 'G-III Apparel Group Ltd.', order: 55648, warehouse: 'NJ', inward: '2026-08-30', received: 360, allocated: 0, shipped: 0, unitPrice: 7.4 },
    { lot: 'L-1034', sku: 'GM-2025-0064422', style: 'GT6036', buyer: 'G-III Apparel Group Ltd.', order: 55443, warehouse: 'NJ', inward: '2026-09-02', received: 300, allocated: 0, shipped: 0, unitPrice: 7.09 },
    { lot: 'L-1038', sku: 'GM-2025-0058840', style: 'GT5521', buyer: 'G-III Apparel Group Ltd.', order: 55345, warehouse: 'LA', inward: '2026-09-18', received: 180, allocated: 0, shipped: 0, unitPrice: 6.85 },
    { lot: 'L-1040', sku: 'GM-2025-0064422', style: 'GT6036', buyer: 'G-III Apparel Group Ltd.', order: 56702, warehouse: 'NJ', inward: '2026-10-01', received: 240, allocated: 0, shipped: 0, unitPrice: 7.09 },
    { lot: 'L-1045', sku: 'GM-2026-0070113', style: 'MJ2290', buyer: 'Myntra Jabong India Pvt Ltd', order: 51931, warehouse: 'GGN', inward: '2026-09-24', received: 500, allocated: 0, shipped: 200, unitPrice: 3.2 },
    { lot: 'L-1048', sku: 'GM-2025-0066120', style: 'GT6210', buyer: 'G-III Apparel Group Ltd.', order: 55880, warehouse: 'LA', inward: '2026-10-10', received: 360, allocated: 0, shipped: 0, unitPrice: 6.4 },
    { lot: 'L-1003', sku: 'GM-2025-0055301', style: 'GT5102', buyer: 'G-III Apparel Group Ltd.', order: 54870, warehouse: 'LA', inward: '2026-06-20', received: 300, allocated: 0, shipped: 300, unitPrice: 8.15 },
  ]
  
  // ---------- small helper functions ----------
  
  export const available = (lot) => lot.received - lot.allocated - lot.shipped
  
  // Age in days since the stock came into the warehouse.
  export const ageInDays = (dateString, today = new Date()) =>
    Math.max(0, Math.floor((today - new Date(dateString)) / 86_400_000))
  
  export const warehouseName = (id) => WAREHOUSES.find((w) => w.id === id)?.name ?? id
  
  export const formatNumber = (n) => n.toLocaleString('en-US')
  
  export const formatUSD = (n) =>
    '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  
  export const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  
  // Status shown on each lot row.
  export function lotStatus(lot, today) {
    const free = available(lot)
    if (free === 0) return { label: 'Fully used', tone: 'grey' }
    if (lot.allocated > 0) return { label: 'Partly reserved', tone: 'warn' }
    if (ageInDays(lot.inward, today) > 60) return { label: 'Ageing', tone: 'bad' }
    return { label: 'Available', tone: 'ok' }
  }