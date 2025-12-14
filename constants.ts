
import { LatexTemplate } from './types';
import { SPRINGER_TEMPLATE } from './templates/springer';
import { IEEE_TEMPLATE } from './templates/ieee';

export const TEMPLATES: LatexTemplate[] = [
  {
    id: 'ieee',
    name: 'IEEE Standard',
    description: 'Portable IEEEtran format. Compatible with Overleaf and standard TeX distributions.',
    classFile: '\\documentclass[conference]{IEEEtran}',
    rawTemplate: IEEE_TEMPLATE
  },
  {
    id: 'springer',
    name: 'General Academic',
    description: 'Universal academic format (Article). Works everywhere without external dependencies.',
    classFile: '\\documentclass{article}',
    rawTemplate: SPRINGER_TEMPLATE
  }
];
