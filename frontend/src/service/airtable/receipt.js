import { getRecords, getRecord } from "./index.js";

export async function getReceipts() {
  return getRecords({
    table: "📑 Quittances",
    view: "Toutes les quittances",
    maxRecords: 10,
    fields: ReceiptFields,
  });
}

export async function getLeases() {
  return getRecords({
    table: "🔗 Bails",
    view: "Tous les bails",
    maxRecords: 10,
    fields: LeaseFields,
  });
}

export async function getTenant() {
  return getRecords({
    table: "👦 Locataires",
    view: "Grid view",
    maxRecords: 10,
    fields: {
      name: "Prénom Nom",
      lastname: "Nom",
      firstname: "Prénom",
      lease: "Bail",
    },
  });
}

export async function getLease(id) {
  return getRecord({
    id,
    table: "🔗 Bails",
    fields: LeaseFields,
  });
}

export const ReceiptFields = {
  paidOn: "Payé le",
  type: "Type de paiement",
  updateReceipt: "Générer la quittance",
  url: "Url",
  on: "Fait le",
  at: "Fait à",
  to: "Jusqu'à",
  from: "A partir de",
  lease: "Bail",
  tenantName: "Nom locataire",
  locationName: "Nom location",
};

export const LeaseFields = {
  rental: "Location",
  tenants: "Locataires",
  rent: "Loyer",
  charge: "Charge",
  total: "Total",
  receipts: "📑 Quittances",
  name: "Nom",
  tenantName: "Nom Locataires",
  locationName: "Nom Location",
};
