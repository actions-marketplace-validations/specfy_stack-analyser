import type { ProviderFile } from '../provider/base';
import type { RuleTechReturn } from '../types';

const FILES = [
  '.stylelint',
  '.stylelintrc.cjs',
  '.stylelintrc.json',
  '.stylelintrc.js',
];

export function detectStylelint(files: ProviderFile[]): RuleTechReturn | false {
  for (const file of files) {
    if (FILES.includes(file.name)) {
      return { name: 'stylelint', type: 'tool' };
    }
  }

  return false;
}
