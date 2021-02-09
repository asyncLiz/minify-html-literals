import * as CleanCSS from 'clean-css';
import { Options as HTMLOptions, minify } from 'html-minifier';
import { TemplatePart } from 'parse-literals';

/**
 * A strategy on how to minify HTML and optionally CSS.
 *
 * @template O minify HTML options
 * @template C minify CSS options
 */
export interface Strategy<O = any, C = any> {
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
   * @param options html minify options
   * @returns minified HTML string
   */
  minifyHTML(html: string, options?: O): string;
  /**
   * Minifies the provided CSS string.
   *
   * @param css the css to minfiy
   * @param options css minify options
   * @returns minified CSS string
   */
  minifyCSS?(css: string, options?: C): string;
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
 * The default <code>clean-css</code> options, optimized for production
 * minification.
 */
export const defaultMinifyCSSOptions: CleanCSS.Options = {};

/**
 * The default <code>html-minifier</code> options, optimized for production
 * minification.
 */
export const defaultMinifyOptions: HTMLOptions = {
  caseSensitive: true,
  collapseWhitespace: true,
  decodeEntities: true,
  minifyCSS: defaultMinifyCSSOptions,
  minifyJS: true,
  processConditionalComments: true,
  removeAttributeQuotes: false,
  removeComments: true,
  removeEmptyAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true
};

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * The default strategy. This uses <code>html-minifier</code> to minify HTML and
 * <code>clean-css</code> to minify CSS.
 */
export const defaultStrategy: Strategy<HTMLOptions, CleanCSS.Options> = {
  getPlaceholder(parts) {
    // Using @ and (); will cause the expression not to be removed in CSS.
    // However, sometimes the semicolon can be removed (ex: inline styles).
    // In those cases, we want to make sure that the HTML splitting also
    // accounts for the missing semicolon.
    const suffix = '();';
    let placeholder = '@TEMPLATE_EXPRESSION';
    while (parts.some(part => part.text.includes(placeholder + suffix))) {
      placeholder += '_';
    }

    return placeholder + suffix;
  },
  combineHTMLStrings(parts, placeholder) {
    return parts.map(part => part.text).join(placeholder);
  },
  minifyHTML(html, options = {}) {
    let minifyCSSOptions: any;
    if (options.minifyCSS) {
      if (
        options.minifyCSS !== true &&
        typeof options.minifyCSS !== 'function'
      ) {
        minifyCSSOptions = { ...options.minifyCSS };
      } else {
        minifyCSSOptions = {};
      }
    } else {
      minifyCSSOptions = false;
    }

    if (minifyCSSOptions) {
      minifyCSSOptions = adjustMinifyCSSOptions(minifyCSSOptions);
    }

    return minify(html, {
      ...options,
      minifyCSS: minifyCSSOptions
    });
  },
  minifyCSS(css, options = {}) {
    const output = new CleanCSS(adjustMinifyCSSOptions(options)).minify(css);
    if (output.errors && output.errors.length) {
      throw new Error(output.errors.join('\n\n'));
    }

    return output.styles;
  },
  splitHTMLByPlaceholder(html, placeholder) {
    // Make the last character (a semicolon) optional. See above.
    return html.split(new RegExp(`${escapeRegExp(placeholder)}?`, 'g'));
    // return html.split(placeholder);
  }
};

export function adjustMinifyCSSOptions(
  options: CleanCSS.Options = {}
): CleanCSS.Options {
  const levelOne: CleanCSS.OptimizationsOptions['1'] = {
    transform(_property: string, value: string) {
      if (value.startsWith('@TEMPLATE_EXPRESSION') && !value.endsWith(';')) {
        // The CSS minifier has removed the semicolon from the placeholder
        // and we need to add it back.
        return `${value};`;
      } else {
        return value;
      }
    }
  };

  const level = options.level;
  if (typeof level === 'undefined' || level === 1) {
    return {
      ...options,
      level: {
        1: levelOne
      }
    };
  } else if (level === 2) {
    return {
      ...options,
      level: {
        1: levelOne,
        2: { all: true }
      }
    };
  } else if (level === 0) {
    return {
      ...options,
      level: 0
    };
  } else {
    const newLevel = { ...level };
    if (!newLevel[1]) {
      newLevel[1] = levelOne;
    } else {
      newLevel[1] = {
        ...levelOne,
        ...newLevel[1]
      };
    }
    return {
      ...options,
      level: newLevel
    };
  }
}
