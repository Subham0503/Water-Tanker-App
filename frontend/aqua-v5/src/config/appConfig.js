// ============================================================
// AQUACONNECT SAFE EDIT CONFIG
// Change values in this file instead of editing page JSX.
// Keep numbers as numbers and text inside quotes.
// ============================================================

export const appConfig = {
  brand: {
    name: "AquaConnect",
    tagline: "Water tanker booking made simple",
  },

  vendorFinance: {
    totalEarnings: 18450,
    securityReserve: 10000,
    pendingAmount: 1250,
    previousWithdrawal: 2000,
  },

  vendorTransactions: [
    { date: "22 Sep", title: "Order #AF123457", amount: 350 },
    { date: "22 Sep", title: "Order #AF123456", amount: 620 },
    { date: "21 Sep", title: "Order #AF123450", amount: 480 },
    { date: "20 Sep", title: "Withdrawal", amount: -2000 },
  ],

  vendor: {
    name: "Vendor 1",
    phone: "9876543210",
    email: "vendor@example.com",
  },

  demo: {
    earningsMonth: "September 2026",
    currencySymbol: "₹",
  },
};

export function formatMoney(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return `${appConfig.demo.currencySymbol}0`;
  return `${appConfig.demo.currencySymbol}${Math.round(amount).toLocaleString("en-IN")}`;
}

export function getAvailableBalance() {
  const total = Number(appConfig.vendorFinance.totalEarnings) || 0;
  const reserve = Number(appConfig.vendorFinance.securityReserve) || 0;
  const pending = Number(appConfig.vendorFinance.pendingAmount) || 0;
  return Math.max(0, total - reserve - pending);
}
