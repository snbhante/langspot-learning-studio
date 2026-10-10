# Contributing to LangSpot

1. Open an issue describing the language, learner level and problem being addressed.
2. Keep code changes focused and include tests where practical.
3. Run `npm run validate:content`, `npm test`, `npm run typecheck`, `npm run lint` and `npm run build` before opening a pull request.
4. Do not copy textbook chapters, commercial dictionaries, audio or fonts without a compatible license.
5. Content contributions must identify author/source, license, dialect/register and review status. Never label a draft expert-reviewed unless a qualified reviewer actually reviewed it.
6. Preserve original Unicode, diacritics, tones and script forms. Normalized search is an index aid only and must not overwrite source text.
7. Do not add private API keys, analytics by default, learner progress uploads or microphone recording without explicit privacy review.

## Content review checklist

- Original form and transliteration checked independently.
- Translation checked in context.
- Register/dialect/variety labeled.
- Grammar explanation and exceptions checked.
- Source and license recorded where relevant.
- Stable ID assigned; existing IDs not recycled.
- Related IDs resolve and validation passes.
