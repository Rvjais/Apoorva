# Service images

Each service has a separate placeholder image referenced by its `<img class="service-image">` in `index.html`.

To use your own photo:

1. Put the image in this folder with a descriptive filename, such as `acne-treatment.jpg`.
2. Change that service's `src` in `index.html` from `assets/services/acne-treatment.svg` to `assets/services/acne-treatment.jpg`.
3. Add an appropriate `alt` description if the photo conveys information. The neutral placeholders currently use an empty `alt` because the service name appears beside them.

Square images work best. The layout crops replacement photos to a consistent thumbnail size using `object-fit: cover`. Replacing an SVG with another SVG using the same filename requires no HTML change.

| Service | Placeholder file |
| --- | --- |
| Acne treatment | acne-treatment.svg |
| Pigmentation treatment | pigmentation-treatment.svg |
| Dark circle reduction | dark-circle-reduction.svg |
| Scars & open pores | scars-open-pores.svg |
| Wrinkle treatments | wrinkle-treatments.svg |
| Skin sagging treatments | skin-sagging-treatments.svg |
| Hair fall & hair loss | hair-fall-hair-loss.svg |
| Dandruff care | dandruff-care.svg |
| Laser hair reduction | laser-hair-reduction.svg |
| Facials | facials.svg |
| Peels | peels.svg |
| Lasers & resurfacing | lasers-resurfacing.svg |
| Dermafrac | dermafrac.svg |
| Skin rejuvenation | skin-rejuvenation.svg |
| Mesotherapy & exosomes | mesotherapy-exosomes.svg |
| Skincare routines | skincare-routines.svg |
| Skin tag & wart removal | skin-tag-wart-removal.svg |
| IV drips | iv-drips.svg |
| Lymphatic drainage therapy | lymphatic-drainage-therapy.svg |
