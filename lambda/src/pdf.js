const PDFDocument = require('pdfkit');
const { color } = require('./config.json');

/**
 *
 * @param {{lease: { rent, charge, total, rental: { address, complement, lessor: { firstname, lastname, address, phone, email }} tenant: { firstname, lastname }}, at, to, from }} receipt
 * @returns
 */
exports.getReceiptPDF = (receipt, destinationPipe) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  if (destinationPipe) doc.pipe(destinationPipe);

  // doc.pipe(fs.createWriteStream('output.pdf'));

  doc
    .fontSize(16)

    .text('QUITTANCE DE LOYER', { align: 'center' })
    .fontSize(12)
    .moveDown()
    .text(
      `Quittance de loyer pour la periode du ${receipt.from} au ${receipt.to}`,
      {
        align: 'center',
      }
    )
    .moveDown(2);

  const myTop = doc.y;
  const marginLeft = doc.x;
  const halfWidth =
    (doc.page.width - doc.page.margins.left - doc.page.margins.right) / 2;

  const nameWidth = doc.widthOfString(
    `${receipt.lease.rental.lessor.firstname} ${receipt.lease.rental.lessor.lastname}`
  );
  const addressWidth = doc.widthOfString(receipt.lease.rental.lessor.address);

  let widthOfBailleurStr = nameWidth > addressWidth ? nameWidth : addressWidth;
  widthOfBailleurStr =
    widthOfBailleurStr > halfWidth ? halfWidth : widthOfBailleurStr;
  doc
    // .moveTo(doc.page.margins.left, myTop)
    .text(
      `BAILLEUR :\n\n${receipt.lease.rental.lessor.firstname} ${receipt.lease.rental.lessor.lastname}\n${receipt.lease.rental.lessor.address}`,
      {
        width: widthOfBailleurStr,
      }
    );

  const spacing = 100;

  doc
    .text(
      `LOCATAIRE :\n\n${receipt.lease.tenant.firstname} ${receipt.lease.tenant.lastname}\n${receipt.lease.rental.address}\n${receipt.lease.rental.complement}`,
      widthOfBailleurStr + spacing,
      myTop
    )
    .moveDown()
    .text(`Fait à ${receipt.at}, le ${receipt.on}.`, {})
    .moveDown(2);

  let miniMargin = 15;

  let point = doc.y;
  doc.text(
    `ADRESSE DE LA LOCATION :\n\n${receipt.lease.rental.address}\n${receipt.lease.rental.complement}`,
    marginLeft + miniMargin,
    undefined,
    {}
  );

  doc
    .rect(
      doc.x - miniMargin,
      point - miniMargin,
      halfWidth * 2,
      doc.y - point + miniMargin * 2
    )
    .stroke(color.primary)
    .moveDown(4);

  point = doc.y;
  const topTab = doc.y;
  doc
    .rect(
      doc.x - miniMargin,
      point - miniMargin,
      halfWidth * 2,
      doc.y - point + miniMargin * 2
    )
    .fill(color.primary);
  doc
    .fillColor('black')
    .text('LIBELLE', marginLeft + miniMargin, doc.y)
    .text('MONTANT', marginLeft + 300 + miniMargin, point, {})
    .moveDown(2);

  point = doc.y;
  doc
    .text('Loyer (hors charges)', marginLeft + miniMargin, doc.y)
    .text(
      `${receipt.lease.rent.toFixed(2)} €`,
      marginLeft + miniMargin + 300,
      point
    )
    .moveDown(2);
  // bottom mid line
  doc
    .moveTo(marginLeft, doc.y - miniMargin)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y - miniMargin)
    .stroke(color.primary);

  point = doc.y;
  doc
    .text('Provision pour charges', marginLeft + miniMargin, doc.y)
    .text(
      `${receipt.lease.charge.toFixed(2)} €`,
      marginLeft + miniMargin + 300,
      point
    )
    .moveDown(2);
  // bottom mid line
  doc
    .moveTo(marginLeft, doc.y - miniMargin)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y - miniMargin)
    .stroke(color.primary);

  point = doc.y;
  doc
    .text('TOTAL', marginLeft + miniMargin, doc.y)
    .fontSize(10)
    .text(`Payé le ${receipt.paidOn} par ${receipt.type}`, {})
    .fontSize(12)
    .text(
      `${receipt.lease.total.toFixed(2)} €`,
      marginLeft + miniMargin + 300,
      point
    )
    .moveDown(2);

  // bottom horizontal line
  doc
    .moveTo(marginLeft, doc.y - miniMargin)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y - miniMargin)
    .stroke(color.primary);
  // vertical separator
  doc
    .moveTo(marginLeft, topTab - miniMargin)
    .lineTo(marginLeft, doc.y - miniMargin)
    .stroke(color.primary)
    .moveTo(marginLeft + 300, topTab)
    .lineTo(marginLeft + 300, doc.y - miniMargin)
    .stroke(color.primary)
    .moveTo(doc.page.width - doc.page.margins.right, topTab)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y - miniMargin)
    .stroke(color.primary);

  doc
    .moveDown()
    .text(
      "Dont quittance, sans prejudice du terme en cours, sous reserve de tous supplements pouvant etre dus en vertu des lois ou conventions applicables et sous reserve de tous les droits et actions du proprietaire, de toutes poursuites qui auraient pu etre engagees et de toutes decisions de justice qui auraient pu etre obtenues. En cas de conge precedemment donne, cette quittance representerait l'indemnite d'occupation et ne saurait etre consideree comme un titre de location.",
      marginLeft,
      undefined
    );
  doc
    .moveDown()
    .text(
      "Cette quittance annule tous les regus qui auraient pu etre donnes pour acompte verse sur le present terme, meme si ces regus portent une date posterieure a la date ci-contre. Le paiement de la presente quittance n'emporte pas presomption de paiement des termes anterieurs."
    );

  doc
    .moveTo(doc.page.margins.left, doc.page.height - doc.page.margins.bottom)
    .lineTo(
      doc.page.width - doc.page.margins.right,
      doc.page.height - doc.page.margins.bottom
    )
    .stroke();

  doc.end();

  return doc;
};
