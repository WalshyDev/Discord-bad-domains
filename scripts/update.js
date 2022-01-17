import path from 'path';
import fs from 'fs/promises';
import fetch from 'node-fetch';
import dateFormat from 'dateformat';
import simpleGit from 'simple-git';

// We want it to be ran from root not scripts
const git = simpleGit({ baseDir: path.resolve('..') });

const BASE = 'https://bad-domains-v2.walshy.dev';

async function run() {
  console.log('Fetching...');
  const { total, found } = await writeBadDomains();
  await fetchAndWrite('/domains-list.json', '../domains-list.json');
  await fetchAndWrite('/domains.json', '../domains.json');
  await fetchAndWrite('/domains.txt', '../domains.txt');

  console.log('Pushing!');
  const percent = ((found / total) * 100).toFixed(2);
  const commitMessage = `${dateFormat(new Date(), 'yyyy-mm-dd')} - Updated domains (Found ${found}/${total} - ${percent}%)`;
  await tryAndPush(
    ['bad-domains.json', 'domains-list.json', 'domains.txt', 'domains.json'],
    commitMessage
  );

  console.log('Done! :)');
}

async function callApi(path) {
  const res = await fetch(`${BASE}${path}`);

  if (res.headers.get('content-type') === 'application/json') {
    return { type: 'json', body: await res.json() };
  } else {
    return { type: 'text', body: await res.text() };
  }
}

async function fetchAndWrite(apiPath, filePath) {
  const resp = await callApi(apiPath);

  if (resp.type === 'json') {
    await fs.writeFile(path.resolve(filePath), JSON.stringify(resp.body, null, 4));
  } else {
    await fs.writeFile(path.resolve(filePath), resp.body);
  }
}

async function writeBadDomains() {
  const resp = await callApi('/bad-domains.json');

  const obj = resp.body;

  await fs.writeFile(path.resolve('../bad-domains.json'), JSON.stringify(obj, null, 4));

  const totalHashes = Object.keys(obj).length;
  const foundHashes = Object.keys(obj).filter(key => obj[key] !== null).length;

  console.log(`Found ${foundHashes} of ${totalHashes} hashes`);
  return { total: totalHashes, found: foundHashes };
}

async function tryAndPush(files, commitMessage) {
  try {
    const result = await git.status();
    if (result.files.length === 0) {
      console.log('No changes to commit');
      return;
    }

    await git.add(files);
    await git.commit(commitMessage);
    await git.push('origin', 'main');
  } catch(e) {
    console.error(e);
  }
}

run();