
import { LatexTemplate } from './types';
import { SPRINGER_TEMPLATE } from './templates/springer';
import { IEEE_TEMPLATE } from './templates/ieee';

export const TEMPLATES: LatexTemplate[] = [
  {
    id: 'acm',
    name: 'ACM Standard',
    description: 'Association for Computing Machinery. Two-column format used in major CS conferences.',
    classFile: '\\documentclass[sigconf]{acmart}'
  },
  {
    id: 'ieee',
    name: 'IEEE Conference',
    description: 'Official IEEE Sponsored Conferences & Symposia (ieeeconf).',
    classFile: 'ieeeconf',
    rawTemplate: IEEE_TEMPLATE
  },
  {
    id: 'springer',
    name: 'Springer Nature',
    description: 'Standard Springer Nature Journal Template (sn-jnl).',
    classFile: 'sn-jnl',
    rawTemplate: SPRINGER_TEMPLATE
  }
];
