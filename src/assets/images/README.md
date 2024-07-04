# Think Ahead image files

This directory contains two important file categories:

-   The official Think Ahead Technologies GmbH logo **master copy**
-   Preview images for the website

## Logo

These have been created using [Inkscape](https://inkscape.org/): the master file is [think-ahead.svg](./think-ahead.svg), and contains the logo itself plus text which can be attached to it.

On any update to the base logo, consider updating _all_ the following files:

-   [favicon.svg](../favicons/favicon.svg), a copy of the master file
-   [apple-touch-icon.png](../favicons/apple-touch-icon.png), a 180x180px export from Inkscape
-   [favicon.ico](../favicons/favicon.ico), converted with [ImageMagick](https://imagemagick.org/):
    -   `magick ../favicons/apple-touch-icon.png ../favicons/favicon.ico`
-   Logo files within the company Drive, both with and without the company name as text.

## Preview images

These files are manually generated, and configured to be used as the thumbnail when site is shared on social media.

The process of generating them is very basic, and could probably be much improved:

1. Take an OSX part-of-screen screenshot (⇧⌘5)
1. Drag the selection so it's 1200x630 (per [documentation](https://ahrefs.com/blog/open-graph-meta-tags/#setting-open-graph-tags-manually)) and resize the window manually so that fits the selection
    - You may wish to alter the HTML slightly to avoid later elements peeking in from the bottom of the frame.
1. Put the file in the directory and link to it from [config.yaml](/src/config.yaml)
