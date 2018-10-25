import { expect } from 'chai';
import { minify } from 'html-minifier';
import { defaultMinifyOptions, defaultStrategy } from '../src/strategy';
import { TemplatePart } from '../node_modules/parse-literals';

describe('strategy', () => {
  describe('default', () => {
    const parts: TemplatePart[] = [
      {
        text: '<h1>',
        start: 0,
        end: 4
      },
      {
        text: '</h1>',
        start: 4,
        end: 5
      }
    ];

    describe('getPlaceholder()', () => {
      it('should return "@TEMPLATE_EXPRESSION();"', () => {
        const placeholder = defaultStrategy.getPlaceholder(parts);
        expect(placeholder).to.equal('@TEMPLATE_EXPRESSION();');
      });

      it('should append "_" if placeholder exists in templates', () => {
        expect(
          defaultStrategy.getPlaceholder([
            { text: '@TEMPLATE_EXPRESSION();', start: 0, end: 19 }
          ])
        ).to.equal('@TEMPLATE_EXPRESSION_();');

        expect(
          defaultStrategy.getPlaceholder([
            { text: '@TEMPLATE_EXPRESSION();', start: 0, end: 19 },
            { text: '@TEMPLATE_EXPRESSION_();', start: 19, end: 38 }
          ])
        ).to.equal('@TEMPLATE_EXPRESSION__();');
      });
    });

    describe('combineHTMLStrings()', () => {
      it('should join part texts by the placeholder', () => {
        const expected = '<h1>EXP</h1>';
        expect(defaultStrategy.combineHTMLStrings(parts, 'EXP')).to.equal(
          expected
        );
      });
    });

    describe('minifyHTML()', () => {
      it('should call minify() with html and options', () => {
        const html = `
          <style>@TEMPLATE_EXPRESSION();</style>
          <h1 class="heading">@TEMPLATE_EXPRESSION();</h1>
          <ul>
            <li>@TEMPLATE_EXPRESSION();</li>
          </ul>
        `;

        expect(defaultStrategy.minifyHTML(html, defaultMinifyOptions)).to.equal(
          minify(html, defaultMinifyOptions)
        );
      });
    });

    describe('splitHTMLByPlaceholder()', () => {
      it('should split string by the placeholder', () => {
        const expected = ['<h1>', '</h1>'];
        expect(
          defaultStrategy.splitHTMLByPlaceholder('<h1>EXP</h1>', 'EXP')
        ).to.deep.equal(expected);
      });
    });
  });
});
