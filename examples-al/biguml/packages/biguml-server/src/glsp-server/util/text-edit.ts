import { Range } from 'vscode-languageclient';

/**
 * Extracts the given range from the text
 * @param range Start and end position of the text to return
 * @param text Text to select range from
 * @returns String within given range
 */
export function getRangeFromText(range: Range, text: string): string {
    const startIndex = nthIndex(text, '\n', range.start.line) + range.start.character + 1;
    const endIndex = nthIndex(text, '\n', range.end.line) + range.end.character + 1;
    return text.substring(startIndex, endIndex);
}

/**
 * Returns the index of the n-th occurence of a given string in a text
 * @param str The text to search in
 * @param pattern The string to find
 * @param n The n-th occurance of the pattern to find
 */
export function nthIndex(str: string, pattern: string, n: number): number {
    let length = str.length,
        i = -1;
    while (n-- && i++ < length) {
        i = str.indexOf(pattern, i);
        if (i < 0) break;
    }
    return i;
}

/**
 * Removes all the comments from the semantic text.
 * Used for functions that look up positions of diagram elements,
 * to clean-up the semantic text beforehand. Otherwise, the comments
 * could contain characters and words that would interfere with the
 * semantic text updates.
 */
export function removeAllComments(semanticText: string): string {
    semanticText = semanticText.replaceAll(/\/\*[\s\S]*?\*\//g, str => ' '.repeat(str.length));
    semanticText = semanticText.replaceAll(/\/\/[^\n\r]*/g, str => ' '.repeat(str.length));
    return semanticText;
}

/**
 * Finds the starting index of the first match of the provided
 * regex in the provided string.
 *
 * Used to find the positions of attribute declarations in the
 * semantic text.
 * @param text The string to search in.
 * @param regex The regex to match in the text.
 * @param startpos Position to start searching from, if empty it starts from the beginning.
 * @returns First position of the matched regex in the text, if not found -1.
 */
export function regexIndexOf(text: string, regex: RegExp, startpos?: number) {
    var indexOf = text.substring(startpos || 0).search(regex);
    return indexOf >= 0 ? indexOf + (startpos || 0) : indexOf;
}

/**
 * Replace an attribute value in a text.
 * @param text To replace the value in.
 * @param oldValue The old value of the attribute.
 * @param newValue The new value of the attribute.
 * @param startingPosition The search for the old attribute value begins at this position in the text.
 */
export function replaceStartingFrom(text: string, oldValue: string, newValue: string, startingPosition?: number) {
    return text.slice(0, startingPosition ?? 0) + text.substring(startingPosition ?? 0).replace(oldValue, newValue);
}

/**
 * Escape an arbitraty text to use it in a regular expression.
 * Also escapes whitespaces.
 * @param text The text to escape.
 * @returns The regular expression compatible text.
 */
export function escapeRegExp(text: string) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s*'); // $& means the whole matched string
}
