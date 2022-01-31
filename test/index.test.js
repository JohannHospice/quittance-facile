const { getPDF } = require('../src/pdf');
const fs = require('fs');
const { uploadFile: upload } = require('../src/drive');

const example = {
  lease: {
    rent: 430,
    charge: 70,
    total: 500,
    rental: {
      address: '1 allée de normandie, 94320 Thiais',
      complement: 'Batiment I 1er',
      lessor: {
        firstname: 'Frantz et Marie-Andrée',
        lastname: 'Hospice et Perugien',
        address: '23 rue mirabeau, 91600 Savigny-sur-Orge',
        phone: '33781700715',
        email: 'johannhospice.dev@gmail.com',
      },
    },
    tenant: {
      firstname: 'Gloria',
      lastname: 'Sossou',
    },
  },
  on: '2022-02-28',
  at: 'Savigny-sur-Orge',
  to: '2022-02-28',
  from: '2022-01-02',
  type: 'virement bancaire',
};

test('adds 1 + 2 to equal 3', async () => {
  const pdf = await getPDF(example);

  fs.writeFileSync('test.pdf', pdf.read());
  console.log();

  upload({ name: 'test.pdf', mimeType: 'application/pdf', body: pdf.read() });
});
