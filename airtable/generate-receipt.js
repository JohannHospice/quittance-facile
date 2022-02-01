// -- Config
const config = input.config({
  title: "Génération de quittance",
  items: [
    input.config.table("receiptTable", {
      label: "📑 Quittances",
    }),
    input.config.field("at", {
      label: "Fait à",
      parentTable: "receiptTable",
    }),
    input.config.field("to", {
      label: "Jusqu'à",
      parentTable: "receiptTable",
    }),
    input.config.field("from", {
      label: "A partir de",
      parentTable: "receiptTable",
    }),
    input.config.field("file", {
      label: "Fichier",
      parentTable: "receiptTable",
    }),

    // -

    input.config.table("leaseTable", {
      label: "🔗 Bails",
    }),
    input.config.field("rent", {
      label: "Loyer",
      parentTable: "leaseTable",
    }),
    input.config.field("charge", {
      label: "Charge",
      parentTable: "leaseTable",
    }),
    input.config.field("total", {
      label: "Total",
      parentTable: "leaseTable",
    }),
  ],
});

// -- Main

let table = await base.getTable("📑 Quittances");

let record = await input.recordAsync(
  "Quelle quittance souhaitez vous générer ?",
  table
);
output.text("🔄 Récupération des données de location...");

if (record) {
  const receipt = await getReceipt(record.id);
  output.text("🔄 Génération de la quittance en cours...");

  try {
    const pdfUrl = await generateReceipt(receipt);
    output.text("✅ Génération terminée");

    output.text(
      "💁 Vous pouvez retrouver la quittance à l'adresse suivante : " + pdfUrl
    );
    await table.updateRecordAsync(record, {
      Url: pdfUrl,
    });
    output.text("✅ Le champs Airtable de la quittance a été mis à jour");
  } catch (error) {
    output.text(
      "❌ Une erreur s'es produite lors de la générationd de la quittance"
    );
    console.log(error);
  }
} else {
  output.text("❌ Aucune quitttance n'a été sélectionnée");
}

// --

async function generateReceipt(receipt) {
  const response = await fetch(
    "https://1x1tjr4ok8.execute-api.eu-west-3.amazonaws.com/default/generate-receipt",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.LAMBDA_API_KEY,
      },
      body: JSON.stringify(receipt),
    }
  );

  return response.json();
}

// -- Fields

async function getRecord(tableId, recordId) {
  let table = base.getTable(tableId);
  let record = await table.selectRecordAsync(recordId);

  if (!record) throw new Error("Bail non defini");
  return record;
}

async function getLessor(id) {
  let lessor = await getRecord("👔 Bailleurs", id);

  return {
    firstname: lessor.getCellValue("Prénom"),
    lastname: lessor.getCellValue("Nom"),
    address: lessor.getCellValue("Adresse"),
    phone: lessor.getCellValue("Téléphone"),
    email: lessor.getCellValue("Email"),
    signature: lessor.getCellValue("Signature"),
  };
}

async function getRental(id) {
  let location = await getRecord("🏠 Locations", id);

  const [{ id: lessorId }] = location.getCellValue("Bailleur");

  return {
    address: location.getCellValueAsString("Adresse"),
    complement: location.getCellValue("Complément d'adresse"),
    lessor: await getLessor(lessorId),
  };
}

async function getTenant(id) {
  let tenant = await getRecord("👦 Locataires", id);

  return {
    firstname: tenant.getCellValue("Prénom"),
    lastname: tenant.getCellValue("Nom"),
  };
}

async function getLease(id) {
  let leaseRecord = await getRecord("🔗 Bails", id);

  const [{ id: locationId }] = leaseRecord.getCellValue("Location");
  const [{ id: tenantId }] = leaseRecord.getCellValue("Locataires");

  return {
    rent: leaseRecord.getCellValue("Loyer"),
    charge: leaseRecord.getCellValue("Charge"),
    total: leaseRecord.getCellValue("Total"),
    rental: await getRental(locationId),
    tenant: await getTenant(tenantId),
  };
}

async function getReceipt(id) {
  let record = await getRecord("📑 Quittances", id);

  const [{ id: leaseId }] = record.getCellValue("Bail");

  return {
    lease: await getLease(leaseId),
    on: record.getCellValueAsString("Fait le"),
    paidOn: record.getCellValueAsString("Payé le"),
    at: record.getCellValueAsString("Fait à"),
    to: record.getCellValue("Jusqu'à"),
    from: record.getCellValue("A partir de"),
    type: record.getCellValueAsString("Type de paiement"),
  };
}
