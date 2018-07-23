import { expect } from 'chai';
import * as min from '../index';
import {
  defaultGenerateSourceMap,
  defaultShouldMinify,
  defaultValidation,
  minifyHTMLLiterals
} from '../src/minifyHTMLLiterals';
import { defaultMinifyOptions, defaultStrategy } from '../src/strategy';

describe('exports', () => {
  it('should export minifyHTMLLiterals() function and defaults', () => {
    expect(min).to.deep.equal({
      minifyHTMLLiterals,
      defaultGenerateSourceMap,
      defaultShouldMinify,
      defaultValidation,
      defaultMinifyOptions,
      defaultStrategy
    });
  });
});
