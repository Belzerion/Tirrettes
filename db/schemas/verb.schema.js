const verbSchema = {
  title: "verb schema",
  description: "describes a verb",
  version: 0,
  primaryKey: "label",
  type: "object",
  properties: {
    label: {
      type: "string",
      maxLength: 100,
    },
    person: {
      type: "string",
    },
  },
  required: ["name", "person"],
};

module.exports = {
  verbSchema,
};
