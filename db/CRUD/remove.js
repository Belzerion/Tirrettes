const removeRow = async (collection, label) => {
  const query = collection.find({
    selector: {
      label: label,
    },
  });
  await query.remove();
};

module.exports = {
  removeRow,
};
