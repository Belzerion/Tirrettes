
const STRUCTURES = {
  dan: ["Determinant", "Adjectif", "Nom"],
  dna: ["Determinant", "Nom", "Adjectif"],
  dana: ["Determinant", "Adjectif1", "Nom", "Adjectif2"],
  danav: ["Determinant", "Adjectif1", "Nom", "Adjectif2", "Verbe"],
  dnav: ["Determinant", "Nom", "Adjectif", "Verbe"],
  dnv: ["Determinant", "Nom", "Verbe"],
};

const LABEL_TO_ID = {
  Determinant: "det",
  Adjectif: "adj",
  Nom: "noun",
  Adjectif1: "adj1",
  Adjectif2: "adj2",
  Verbe: "verb",
};

function loadCatSelection() {
  const selection = document.getElementById("rand").checked ? "rand" : "custom";
  selection == "rand" ? LoadCatNumber() : loadCustomizedSelection();
}


function LoadCatNumber() {
  const structureValue = document.getElementById("structure").value;
  const structure = STRUCTURES[structureValue];
  const div = document.getElementById("categoryNumber");
  div.innerHTML = structure
    .map((str) => {
      let optgroup = str;
      if (str === "Adjectif1" || str === "Adjectif2") {
        optgroup = optgroup.slice(0, -1);
      }
      return (
        '<select id="' +
        LABEL_TO_ID[str] +
        '">' +
        "<optgroup label=" +
        optgroup +
        ">" +
        '<option value="5">' +
        5 +
        "</option>" +
        '<option value="10">' +
        10 +
        "</option>" +
        '<option value="20">' +
        20 +
        "</option>" +
        +"</optgroup>" +
        "</select>"
      );
    })
    .reduce((pre, cur) => (pre += cur), "");
}

function Launch() {
  let url = "Practise.html?";
  const mode = document.getElementById("mode-one").checked
    ? "modeOne"
    : "modeTwo";

  url += "mode=" + mode + "&";
  const structureValue = document.getElementById("structure").value;
  url += "structure=" + structureValue + "&";
  const structure = STRUCTURES[structureValue];
  structure.forEach((str) => {
    const number = document.getElementById(LABEL_TO_ID[str]).value;
    url += LABEL_TO_ID[str] + "=" + number + "&";
  });
  url = url.slice(0, -1);
  window.location.href = url;
}
