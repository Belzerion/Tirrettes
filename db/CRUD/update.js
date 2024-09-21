const updateRow = async (collection, label, newLabel, newGender, newNumber) => {
  const query = collection.find({
    selector: {
      label: label,
    },
  });
  await query.update({
    $set: {
      label: newLabel,
      gender: newGender,
      number: newNumber,
    },
  });
};

const updateVerbRow = async (verbCollection, label, newLabel, person) => {
  const query = verbCollection.find({
    selector: {
      label: label,
    },
  });
  await query.update({
    $set: {
      label: newLabel,
      person: person,
    },
  });
};

module.exports = {
  updateRow,
  updateVerbRow,
};
