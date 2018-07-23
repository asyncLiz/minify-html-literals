import { Options, minify } from 'html-minifier';
import { TemplatePart } from 'parse-literals';

/**
 * A strategy on how to minify HTML.
 */
export interface Strategy<O = any> {
  /**
   * Retrieve a placeholder for the given array of template parts. The
   * placeholder returned should be the same if the function is invoked with the
   * same array of parts.
   *
   * The placeholder should be an HTML-compliant string that is not present in
   * any of the parts' text.
   *
   * @param parts the parts to get a placeholder for
   * @returns the placeholder
   */
  getPlaceholder(parts: TemplatePart[]): string;
  /**
   * Combines the parts' HTML text strings together into a single string using
   * the provided placeholder. The placeholder indicates where a template
   * expression occurs.
   *
   * @param parts the parts to combine
   * @param placeholder the placeholder to use between parts
   * @returns the combined parts' text strings
   */
  combineHTMLStrings(parts: TemplatePart[], placeholder: string): string;
  /**
   * Minfies the provided HTML string.
   *
   * @param html the html to minify
   * @param options minify options
   * @returns minified HTML string
   */
  minifyHTML(html: string, options?: O): string;
  /**
   * Splits a minfied HTML string back into an array of strings from the
   * provided placeholder. The returned array of strings should be the same
   * length as the template parts that were combined to make the HTML string.
   *
   * @param html the html string to split
   * @param placeholder the placeholder to split by
   * @returns an array of html strings
   */
  splitHTMLByPlaceholder(html: string, placeholder: string): string[];
}

/**
 * The default <code>html-minifier</code> options, optimized for production
 * minification.
 */
export const defaultMinifyOptions: Options = {
  caseSensitive: true,
  collapseBooleanAttributes: true,
  collapseWhitespace: true,
  decodeEntities: true,
  minifyCSS: true,
  minifyJS: true,
  processConditionalComments: true,
  removeAttributeQuotes: true,
  removeComments: true,
  removeEmptyAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  removeTagWhitespace: true,
  sortAttributes: true,
  sortClassName: true,
  trimCustomFragments: true,
  useShortDoctype: true
};

/**
 * The default strategy. This uses <code>html-minifier</code> to minify HTML.
 */
export const defaultStrategy: Strategy<Options> = {
  getPlaceholder(parts: TemplatePart[]): string {
    let placeholder = 'TEMPLATE_EXPRESSION';
    while (parts.some(part => part.text.includes(placeholder))) {
      placeholder += '_';
    }

    return placeholder;
  },
  combineHTMLStrings(parts: TemplatePart[], placeholder: string): string {
    return parts.map(part => part.text).join(placeholder);
  },
  minifyHTML(html: string, options?: Options): string {
    return minify(html, options);
  },
  splitHTMLByPlaceholder(html: string, placeholder: string): string[] {
    return html.split(placeholder);
  }
};
