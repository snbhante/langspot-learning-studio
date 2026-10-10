# LangSpot PWA features and compatibility

The manifest and service worker were adapted from the supplied Digital Dhamma Library files to LangSpot identity and paths. Included manifest fields: language/direction, name/short name/description, categories, theme/background colors, start URL/scope/id, standalone display overrides, orientation, raster icons including maskable, app shortcuts, wide/narrow screenshots, related-application preference, audio file handlers, launch handler, custom protocol handlers and share target.

## Browser/platform limitations
- Support for `file_handlers`, `launch_handler`, `protocol_handlers`, `display_override`, maskable icons and app shortcuts varies by browser and OS; unsupported fields are ignored. Install the app to test shortcuts.
- Share target is intercepted by the service worker and stored locally in IndexedDB. Test on HTTPS/localhost in a supporting installed browser. Shared files are local to that browser/device.
- Audio file handler is a progressive entry page with a file picker and audio player; OS-level file association is browser dependent.
- Protocol handlers use `web+langspot` and `web+language`; browser registration prompts/permissions vary. Only HTTP(S) destinations are made clickable by the handler page.
- Voice models are not bundled or installed by this static app. The Settings page lists voices exposed by `speechSynthesis.getVoices()`. Install OS/browser language packs manually if missing. Browser voice names do not reliably declare gender, so male/female selection is best effort. Pāḷi and Sanskrit may have no accurate installed voice.
- The supplied screenshot assets are static illustrative SVG previews, not screenshots captured from a live browser. Replace them with real captures after final UI review if desired.

## Cache and data
The service worker caches same-origin GET responses after successful visits and provides a cached app-shell fallback for navigation. Shared items are stored in IndexedDB, not uploaded to a server. The cache is versioned and only old `langspot-*` caches are removed.
