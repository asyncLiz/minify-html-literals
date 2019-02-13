import { expect } from 'chai';
import * as min from '../index';
import {
  defaultGenerateSourceMap,
  defaultShouldMinify,
  defaultShouldMinifyCSS,
  defaultValidation,
  minifyHTMLLiterals
} from '../src/minifyHTMLLiterals';
import {
  defaultMinifyCSSOptions,
  defaultMinifyOptions,
  defaultStrategy
} from '../src/strategy';

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
      defaultStrategy
    });
  });
});
