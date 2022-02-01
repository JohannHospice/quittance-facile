import Airtable from "airtable";
import { getKeys, unsetKeys } from "../../providers/LoginProvider";

export const AIRTABLE_API_KEY_SESSION_STORAGE = "airtable-api-key";
export const AIRTABLE_BASE_KEY_SESSION_STORAGE = "airtable-base-key";

function init() {
  const { key, base } = getKeys();

  Airtable.configure({
    endpointUrl: "https://api.airtable.com",
    apiKey: key,
  });
  return Airtable.base(base);
}

export async function getRecords({ table, view, maxRecords, fields }) {
  const base = init();
  return new Promise((resolve, reject) => {
    let accumulator = [];
    base(table)
      .select({
        // Selecting the first 3 records in Toutes les quittances:
        maxRecords: maxRecords,
        view: view,
      })
      .eachPage(
        (records, fetchNextPage) => {
          accumulator = [
            ...accumulator,
            ...records.map((record) => transformRecord(record, fields)),
          ];

          fetchNextPage();
        },
        (err) => {
          if (err) {
            if (err.statusCode) {
              unsetKeys();
            }
            return reject(err);
          }
          console.log("getRecords", accumulator, { table, view, maxRecords, fields });
          resolve(accumulator);
        }
      );
  });
}

export async function getRecord({ table, id, fields }) {
  const base = init();
  return new Promise((resolve, reject) => {
    base(table).find(id, (err, record) => {
      if (err) {
        unsetKeys();
        return reject(err);
      }
      resolve(transformRecord(record, fields));
    });
  });
}

function transformRecord(record, fields) {
  return {
    ...record,
    data: Object.keys(fields).reduce(
      (acc, key) => ({
        ...acc,
        [key]: record.get(fields[key]),
      }),
      []
    ),
  };
}
