const detSchema = {
  title: "determinant schema",
  description: "describes a determinant",
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
  detSchema,
};
