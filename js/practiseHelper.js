function computeAllPossibilities(carouselsData) {
  const init = carouselsData[0];
  init.forEach((elem) => {
    const gender = elem?.gender;
    const number = elem?.number;
    const person = elem?.person;
    call(gender, number, person, carsous);
  });
}
