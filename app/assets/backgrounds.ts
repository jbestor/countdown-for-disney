// 15 Disney background images — replace with actual licensed assets
// Filenames mirror the original iOS/Android apps (C4D_iOS ES branch bg_orig/)
export const BACKGROUNDS = [
  { id: 0, label: 'Castle', source: require('./bg/castle.jpg') },
  { id: 1, label: 'Side Castle', source: require('./bg/side_castle.jpg') },
  { id: 2, label: 'Balloon', source: require('./bg/balloon.jpg') },
  { id: 3, label: 'Fireworks', source: require('./bg/fireworks.jpg') },
  { id: 4, label: 'Golf Ball', source: require('./bg/golf_ball.jpg') },
  { id: 5, label: 'Haunted Mansion', source: require('./bg/haunted_mansion.jpg') },
  { id: 6, label: 'Hat', source: require('./bg/hat.jpg') },
  { id: 7, label: 'Kidani', source: require('./bg/kidani.jpg') },
  { id: 8, label: 'Kidani Chandelier', source: require('./bg/kidani_chandelier.jpg') },
  { id: 9, label: "Mad Tea Party", source: require('./bg/mad_tea_party.jpg') },
  { id: 10, label: "Mickey's House", source: require('./bg/mickeys_house.jpg') },
  { id: 11, label: 'Poly Waterfall', source: require('./bg/poly_waterfall.jpg') },
  { id: 12, label: 'Expedition Everest', source: require('./bg/expedition_everest.jpg') },
  { id: 13, label: 'Stitch', source: require('./bg/stitch.jpg') },
  { id: 14, label: 'Tree of Life', source: require('./bg/tree_of_life.jpg') },
] as const;

export type BackgroundId = typeof BACKGROUNDS[number]['id'];
