const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(__dirname, 'token.json');
const content = fs.readFileSync(path.join(__dirname, 'credentials.json'));
const credentials = JSON.parse(content);

async function getDrive() {
  return google.drive({ version: 'v3', auth: await authorize() });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize() {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  try {
    const token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
    // Check if we have previously stored a token.
  } catch (error) {
    return getAccessToken(oAuth2Client);
  }
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
async function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((res, rej) => {
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        res(oAuth2Client);
      });
    });
  });
}

exports.listFiles = async function (q) {
  const drive = await getDrive();

  return new Promise((resolve, reject) => {
    drive.files.list(
      {
        q,
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive',
        pageToken: null,
      },
      (err, res) => {
        if (err) return reject('The API returned an error: ' + err);
        resolve(res.data.files);
      }
    );
  });
};

exports.uploadFile = async function ({ name, parents, mimeType, body }) {
  const drive = await getDrive();

  return new Promise((resolve, reject) => {
    drive.files.create(
      {
        keepRevisionForever: true,
        resource: {
          name,
          parents,
        },
        media: {
          mimeType,
          body,
        },
        fields: 'id',
      },
      function (err, file) {
        if (err) return reject(err);
        resolve(file);
      }
    );
  });
};
