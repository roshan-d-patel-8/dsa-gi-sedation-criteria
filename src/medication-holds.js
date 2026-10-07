// Transcribed from Roshan's supplied DSA GI dropdown screenshots, 2026-10-07.
// Cropped follow-up instructions are excluded; durations and dose counts are preserved.
export const medicationHoldSections = [
  {
    id: "blood-thinners",
    title: "Blood thinners",
    subtitle: "DOACs, warfarin & antiplatelets",
    groups: [
      {
        timing: "2 days before",
        entries: [
          { medications: "Apixaban (Eliquis), dabigatran (Pradaxa), edoxaban (Savaysa), cilostazol (Pletal)", detail: "Skip 4 doses" },
          { medications: "Rivaroxaban (Xarelto)", detail: "Skip 2 doses" },
        ],
      },
      {
        timing: "3 days before",
        entries: [{ medications: "Dipyridamole (Aggrenox)", detail: "Skip 6 doses" }],
      },
      {
        timing: "5 days before",
        entries: [{ medications: "Clopidogrel (Plavix), warfarin (Coumadin), ticagrelor (Brilinta), prasugrel (Effient)" }],
      },
    ],
  },
  {
    id: "diabetes-meds",
    title: "Diabetes medications",
    subtitle: "Grouped by hold interval",
    groups: [
      {
        timing: "Morning of procedure",
        entries: [{ medications: "Exenatide (Byetta), lixisenatide (Adlyxin), liraglutide (Victoza, Saxenda)" }],
      },
      {
        timing: "3 days before",
        entries: [{ medications: "Canagliflozin (Invokana), dapagliflozin (Farxiga), empagliflozin (Jardiance), bexagliflozin (Brenzavvy)" }],
      },
      {
        timing: "4 days before",
        entries: [{ medications: "Ertugliflozin (Steglatro)" }],
      },
      {
        timing: "1 week before",
        entries: [{ medications: "Dulaglutide (Trulicity), semaglutide (Ozempic, Wegovy, Rybelsus), exenatide (Bydureon), tirzepatide (Mounjaro, Zepbound)" }],
      },
    ],
  },
];
