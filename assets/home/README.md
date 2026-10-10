# Skinic by Dr. Apurva homepage

The homepage follows the four screenshots provided by the user: Clinic Dermatech's rounded campaign banner and layered navigation, Garekars' photographic service mosaic and blurred appointment section, and Dr. Anwesha's numbered, staggered treatment gallery. See `SOURCE-SECTIONS.md` for the complete reference audit and source selectors.

The original `logo.png` is unchanged. The palette uses ivory, charcoal, warm brown, and logo-derived gold. The header sets the white-and-gold logo on a charcoal plaque; the footer uses a dark background. All fonts and production photographs load locally, independently of `Homepage-Refference/`.

## Patient tools

- Six-concern finder with relevant services and preparation guidance.
- Searchable/filterable 19-service directory, accessible from the expandable directory or navigation menus.
- Featured care buttons with individual consultation information.
- Validated appointment enquiry with name, phone, optional email, concern, and preferred date/time.
- Reviewable email draft, direct phone/email links, the supplied Green Park professional address, and a map link.
- Persistent mobile call and appointment buttons.

Enquiries open in the visitor's email app; the clinic confirms availability. There is no booking backend. Contact details and professional credentials come from the supplied doctor profile.

## Motion and accessibility

The hero rotates through three clinical stories, with crossfades, photo drift, staged text entrances, manual arrows/dots, play/pause, keyboard controls, and touch swipes. It pauses during interaction and when out of view. Scroll reveals, counting credentials, photo hover effects, and subtle appointment-background movement add motion throughout. Reduced-motion preferences disable decorative animation and automatic rotation. Hidden slides are inert, form labels remain associated with their fields, and the full page is visible without JavaScript.

## Image credits

| Local asset | Photographer/source |
| --- | --- |
| `patient-consult.webp` | Nappy / Unsplash ? https://unsplash.com/photos/J5UTvRgse7Q |
| `medical-room.webp` | Martha Dominguez de Gouveia / Unsplash ? https://unsplash.com/photos/empty-hospital-bed-ShJUYkshceY |
| `clinical-assessment.webp`, numbered treatment photos | Supplied Dr. Anwesha reference's local treatment assets |
| `featured-1.webp` through `featured-7.webp` | Supplied Garekars reference's local service photographs |

Photographs are illustrative, not Skinic facilities, patient results, or Dr. Apurva's portrait. The doctor introduction uses the clearly labelled consultation photo rather than a stand-in portrait.

## Files and preview

`home.css` provides base styles, `reference.css` and `extracted-sections.css` retain selected reference compositions, and `visual-refresh.css` implements the screenshot-driven visual revision. `home.js` handles patient tools, navigation, sliders, and motion.

Open `index.html` directly, or serve the project with `python -m http.server 8000`. Reference audits, desktop/mobile captures, and verification results are in `design-review/visual-refresh/`.
