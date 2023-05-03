import { expect } from 'chai';
import * as min from '../../index.js';
import {
  defaultGenerateSourceMap,
  defaultShouldMinify,
  defaultShouldMinifyCSS,
  defaultValidation,
  minifyHTMLLiterals
} from '../minifyHTMLLiterals.js';
import {
  adjustMinifyCSSOptions,
  defaultMinifyCSSOptions,
  defaultMinifyOptions,
  defaultStrategy
} from '../strategy.js';

describe('exports', () => {
  it('should export minifyHTMLLiterals() function and defaults', () => {
    expect(min).to.deep.equal({
      minifyHTMLLiterals,
      defaultGenerateSourceMap,
      defaultShouldMinify,
      defaultShouldMinifyCSS,
      defaultValidation,
      defaultMinifyOptions,
      defaultMinifyCSSOptions,
      defaultStrategy,
      adjustMinifyCSSOptions
    });
  });
});
