const adjSchema = {
  title: "adjective schema",
  description: "describes a adjective",
  version: 0,
  primaryKey: "label",
  type: "object",
  properties: {
    label: {
      type: "string",
      maxLength: 100,
    },
    gender: {
      type: "string",
    },
    number: {
      typê: "string",
    },
  },
  required: ["name", "gender", "number"],
};

module.exports = {
  adjSchema,
};
