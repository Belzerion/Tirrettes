const getFilteredCollection = async (collection, gender, number) => {
  const query = await collection
    .find({
      selector: {
        gender: gender,
        number: number,
      },
    })
    .exec();
  return query;
};

const getCollection = async (collection) => {
  const query = await collection.find().exec();
  return query;
};

module.exports = {
  getFilteredCollection,
  getCollection,
};
