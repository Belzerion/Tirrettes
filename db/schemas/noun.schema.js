const nounSchema = {
  title: "noun schema",
  description: "describes a noun",
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
  nounSchema,
};
