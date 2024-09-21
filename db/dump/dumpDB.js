const { writeFile } = require("fs");
const { join } = require("path");
const { promisify } = require("util");
const writeFileAsync = promisify(writeFile);
const { addRxPlugin } = require("rxdb");
const { RxDBJsonDumpPlugin } = require("rxdb/plugins/json-dump");
const fs = require("fs");
const path = require("path");
const util = require("util");
addRxPlugin(RxDBJsonDumpPlugin);

const readFile = util.promisify(fs.readFile);

const DET_PATH = path.join(__dirname, "./data/determinant.json");
const NOUN_PATH = path.join(__dirname, "./data/noun.json");
const ADJ_PATH = path.join(__dirname, "./data/adj.json");
const VERB_PATH = path.join(__dirname, "./data/verb.json");

/* const dumpDB = async (db) => {
    const databaseObj = await db.exportJSON();
    await writeFileAsync(join(__dirname, './data/determinant.json'), JSON.stringify(databaseObj, null, 2)).catch(console.error);
} */

const saveVerb = async (db) => {
  const databaseObj = await db.verb.exportJSON();
  await writeFileAsync(
    join(VERB_PATH),
    JSON.stringify(databaseObj, null, 2)
  ).catch(console.error);
};

const saveDet = async (db) => {
  const databaseObj = await db.determinant.exportJSON();
  await writeFileAsync(
    join(DET_PATH),
    JSON.stringify(databaseObj, null, 2)
  ).catch(console.error);
};

const saveNoun = async (db) => {
  const databaseObj = await db.noun.exportJSON();
  await writeFileAsync(
    join(NOUN_PATH),
    JSON.stringify(databaseObj, null, 2)
  ).catch(console.error);
};

const saveAdj = async (db) => {
  const databaseObj = await db.adjective.exportJSON();
  await writeFileAsync(
    join(ADJ_PATH),
    JSON.stringify(databaseObj, null, 2)
  ).catch(console.error);
};

const importVerb = async (db) => {
  const content = await readFile(VERB_PATH);
  if (content.length == 0) return;
  const jsonObj = JSON.parse(content);
  await db.verb.importJSON(jsonObj);
};

const importDet = async (db) => {
  const content = await readFile(DET_PATH);
  const jsonObj = JSON.parse(content);
  await db.determinant.importJSON(jsonObj);
};

const importNoun = async (db) => {
  const content = await readFile(NOUN_PATH);
  const jsonObj = JSON.parse(content);
  await db.noun.importJSON(jsonObj);
};

const importAdj = async (db) => {
  const content = await readFile(ADJ_PATH);
  const jsonObj = JSON.parse(content);
  await db.adjective.importJSON(jsonObj);
};
const importDump = async (db) => {
  await importNoun(db);
  await importAdj(db);
  await importDet(db);
  await importVerb(db);
};

module.exports = {
  importAdj,
  importNoun,
  importDet,
  importVerb,
  importDump,
  saveAdj,
  saveDet,
  saveNoun,
  saveVerb,
};
