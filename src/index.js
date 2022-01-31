const { listFiles, uploadFile } = require('./drive');
const { getReceiptPDF } = require('./pdf');

const QUITTANCE_FOLDER_NAME = 'Mes quittances Airtable';
const allowOrigin = '*';

exports.handler = async function (event) {
  try {
    console.log({ event });

    const receipt = JSON.parse(event.body);
    const receiptPDF = getReceiptPDF(receipt);

    const [folder] = await listFiles(`name='${QUITTANCE_FOLDER_NAME}'`);
    console.log({ folder });

    const uploaded = await uploadFile({
      mimeType: 'application/pdf',
      name: getReceiptFilename(receipt),
      body: receiptPDF,
      parents: [folder.id],
    });
    console.log({ uploaded });

    return httpResponse({
      statusCode: 200,
      body: `https://drive.google.com/open?id=${uploaded.data.id}`,
    });
  } catch (error) {
    console.error(error);
    return httpResponse({
      statusCode: 400,
      body: error,
    });
  }
};

function getReceiptFilename(receipt) {
  const date = new Date(receipt.to);
  return `quittance.${
    receipt.lease.tenant.lastname
  }.${date.getUTCMonth()}${date.getUTCFullYear()}.pdf`;
}

function httpResponse({ statusCode, body }) {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers':
        'Content-Type,X-Amz-Date,X-Amz-Security-Token,x-api-key,Authorization,Origin,Host,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers',
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT',
      'X-Requested-With': allowOrigin,
    },
  };
}
