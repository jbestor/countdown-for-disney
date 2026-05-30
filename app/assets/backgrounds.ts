// 15 Disney background images — sourced from C4D_iOS ES branch
// DisneyCountdown/Images.xcassets/Backgrounds/
export const BACKGROUNDS = [
  { id: 0, label: 'Castle', source: require('./bg/castle.png') },
  { id: 1, label: 'WDW Castle', source: require('./bg/wdw_castle.png') },
  { id: 2, label: 'Side Castle', source: require('./bg/side_castle.png') },
  { id: 3, label: 'Rapunzel Tower', source: require('./bg/rapunzel_tower.png') },
  { id: 4, label: 'Golf Ball', source: require('./bg/golf_ball.png') },
  { id: 5, label: 'Haunted Mansion', source: require('./bg/haunted_mansion.png') },
  { id: 6, label: 'Hat', source: require('./bg/hat.png') },
  { id: 7, label: 'Kidani', source: require('./bg/kidani.png') },
  { id: 8, label: 'Kidani Chandelier', source: require('./bg/kidani_chandelier.png') },
  { id: 9, label: "Mickey's House", source: require('./bg/mickeys_house.png') },
  { id: 10, label: 'Poly Waterfall', source: require('./bg/poly_waterfall.png') },
  { id: 11, label: 'Expedition Everest', source: require('./bg/expedition_everest.png') },
  { id: 12, label: 'Stitch', source: require('./bg/stitch.png') },
  { id: 13, label: 'Tree of Life', source: require('./bg/tree_of_life.png') },
  { id: 14, label: '3794', source: require('./bg/3794.png') },
] as const;

export type BackgroundId = typeof BACKGROUNDS[number]['id'];
