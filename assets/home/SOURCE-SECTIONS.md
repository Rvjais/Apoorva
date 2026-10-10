# Homepage reference audit and implementation

All four complete local reference homepages were audited, including their hero, services, clinician introductions, technology, consultation, results, social, FAQ, booking, and footer sections. Full-page captures and the section inventory are in `design-review/visual-refresh/`; `reference-audit.json` records the headings and positions in each homepage.

The user's four supplied screenshots drive this revision:

| Screenshot | Source | Homepage implementation |
| --- | --- | --- |
| 1 ? tall/short photos and large treatment numbers | Dr. Anwesha, `.elementor-element-10f37f4` / `.elementor-element-03fe2ae` | `#treatments`: alternating photo proportions, oversized 01?08 numerals, category controls, horizontal navigation, and individual care enquiries. The highlighted skin tag removal, wrinkle-care, and filler photographs are local copies of the source assets. |
| 2 ? photographic services with text overlays | Garekars, `#explore-services` | `#services`: the original two-wide / three-narrow / two-wide arrangement and all seven source photographs, with Skinic service labels, gradient text overlays, animated lines, image zoom, and working care buttons. |
| 3 ? blurred clinic backdrop and translucent booking panel | Garekars, `section.testimonials .background .booking-box` | `#contact`: a full-width blurred medical image, translucent gold form, thin underlined fields, real contact details, and preferred appointment date/time. It validates the fields, then transfers the enquiry into the reviewable email form. |
| 4 ? rounded banner, layered navigation, social rail, and advantage row | Clinic Dermatech, homepage navigation and banner | `.site-header`, `.campaign-shell`, `.skinic-advantage`: layered navigation with service/concern menus, a wide rounded photographic slider, left social/contact rail, serif campaign typography, slide controls, and a four-part credential row. |

The selected Dr. Anwesha split feature panel (`#about`) and Isya's three-column consultation collage (`#your-visit`) remain, with a unified ivory, charcoal, brown, and logo-derived gold palette.

## Motion

The campaign has automatic seven-second crossfades, manual arrows/dots, a play/pause button, touch swipes, and keyboard navigation. Rotation pauses on hover, focus, and when the banner or browser tab is out of view. Inactive slides are inert. Photos drift gently, banner copy enters in sequence, sections reveal on scroll, and credential numbers count up once. Service photos zoom on hover/focus, overlay lines expand, and the blurred appointment background moves subtly with scrolling. Reduced-motion preferences disable decorative motion and automatic rotation.

## Practical care paths

The six-concern finder remains near the top. The full searchable/filterable 19-service directory is available below the numbered gallery, in an expandable panel that also opens directly from the services navigation. Every featured service opens its relevant consultation information. The appointment form collects name, phone, optional email, concern, and optional date/time preferences; it opens a reviewable enquiry rather than confirming a booking. Phone, email, map, and mobile appointment links remain available.

## Assets and content

The original `logo.png` is unchanged. Header/footer styling gives its white script sufficient contrast. Playfair Display is copied from the supplied Clinic Dermatech font assets; Gilda Display and Manrope are local. Source treatment assets are copied into `assets/home/`, so the main page does not depend on the ignored reference directory.

The clinical assessment and treatment photographs are illustrative. The medical room and consultation photos are the existing Unsplash assets, credited in the homepage. The doctor introduction uses an explicitly labelled, faceless consultation photo instead of the previous illustrated portrait. Clinical credentials, services, and contact information remain specific to Dr. Apurva Aditi; reference-clinic promotions, review counts, locations, and patient results are not presented as Skinic claims.

`visual-refresh.css` implements this revision over the existing base and retained reference section styles. `home.js` provides the patient tools, menus, carousels, and animation behaviour. `design-review/visual-refresh/verify-homepage.py` exercises the interactions, reduced-motion fallback, and layouts from 320px to 1920px.
