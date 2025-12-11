import { LatexTemplate } from './types';

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
    description: 'IEEE Computer Society proceedings. Classic two-column layout.',
    classFile: '\\documentclass[conference]{IEEEtran}'
  },
  {
    id: 'springer',
    name: 'Springer LNCS',
    description: 'Lecture Notes in Computer Science. Single column, focus on readability.',
    classFile: '\\documentclass{llncs}'
  }
];

// Mock data to prevent app crash if API key is missing during testing, 
// though the prompt requires strictly functional code.
// The service layer checks for process.env.API_KEY.
