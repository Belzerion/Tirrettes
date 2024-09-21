const { createRxDatabase, addRxPlugin } = require("rxdb");
const { RxDBQueryBuilderPlugin } = require("rxdb/plugins/query-builder");
const { RxDBDevModePlugin } = require("rxdb/plugins/dev-mode");
const { addPouchPlugin, getRxStoragePouch } = require("rxdb/plugins/pouchdb");
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBDevModePlugin);
addPouchPlugin(require("pouchdb-adapter-memory"));
const { importDump } = require("./dump");
const { detSchema, nounSchema, adjSchema, verbSchema } = require("./schemas");

async function createDatabase(name, adapter) {
  const db = await createRxDatabase({
    name,
    storage: getRxStoragePouch(adapter),
  });

  await db.addCollections({
    determinant: {
      schema: detSchema,
    },
    noun: {
      schema: nounSchema,
    },
    adjective: {
      schema: adjSchema,
    },
    verb: {
      schema: verbSchema,
    },
  });

  await importDump(db);

  return db;
}

module.exports = {
  createDatabase,
};
