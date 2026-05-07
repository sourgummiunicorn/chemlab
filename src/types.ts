export interface Element {
  symbol: string;
  name: string;
  color: string;
  atomicNumber: number;
  description: string;
}

export interface Molecule {
  formula: string;
  name: string;
  composition: Record<string, number>;
  description: string;
  funFact: string;
}

export const ELEMENTS: Record<string, Element> = {
  H: { symbol: 'H', name: 'Hydrogen', color: '#60A5FA', atomicNumber: 1, description: 'The lightest and most common element in the universe!' },
  C: { symbol: 'C', name: 'Carbon', color: '#4B5563', atomicNumber: 6, description: 'The building block of all life on Earth.' },
  O: { symbol: 'O', name: 'Oxygen', color: '#EF4444', atomicNumber: 8, description: 'The gas we breathe to stay alive.' },
  N: { symbol: 'N', name: 'Nitrogen', color: '#8B5CF6', atomicNumber: 7, description: 'Makes up 78% of the air around us.' },
  Na: { symbol: 'Na', name: 'Sodium', color: '#F59E0B', atomicNumber: 11, description: 'A soft, silvery metal that loves to react!' },
  Cl: { symbol: 'Cl', name: 'Chlorine', color: '#10B981', atomicNumber: 17, description: 'A green-yellow gas that helps keep pools clean.' },
};

export const MOLECULES: Molecule[] = [
  {
    formula: 'H2O',
    name: 'Water',
    composition: { H: 2, O: 1 },
    description: 'The most important liquid for life!',
    funFact: 'Your body is about 60% water!'
  },
  {
    formula: 'CO2',
    name: 'Carbon Dioxide',
    composition: { C: 1, O: 2 },
    description: 'The gas that plants "breathe" in.',
    funFact: 'CO2 is what makes the bubbles in your soda!'
  },
  {
    formula: 'CH4',
    name: 'Methane',
    composition: { C: 1, H: 4 },
    description: 'A simple gas often used for fuel.',
    funFact: 'Methane is the main part of natural gas.'
  },
  {
    formula: 'NaCl',
    name: 'Table Salt',
    composition: { Na: 1, Cl: 1 },
    description: 'The white crystals we use to season food.',
    funFact: 'Salt was once so valuable it was used as money!'
  },
  {
    formula: 'O2',
    name: 'Oxygen Gas',
    composition: { O: 2 },
    description: 'The form of oxygen we breathe.',
    funFact: 'About 21% of Earth\'s atmosphere is oxygen.'
  },
  {
    formula: 'N2',
    name: 'Nitrogen Gas',
    composition: { N: 2 },
    description: 'The most common gas in our air.',
    funFact: 'Liquid nitrogen is so cold it can freeze a flower instantly!'
  }
];
