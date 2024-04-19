# <img src="https://raw.githubusercontent.com/think-ahead-technologies/site/main/src/assets/images/think-ahead.svg" alt="Logo" height="36"> Think Ahead public website

Static public site for _Think Ahead Technologies GmbH_, built on [Astro 4.0](https://astro.build/) and deployed in [🇬🇧 English](https://think-ahead.tech/en) and [🇩🇪 German](https://think-ahead.tech/) using [Netlify](https://app.netlify.com/sites/think-ahead-technologies/overview).

<br>

![Homepage preview](/src/assets/images/en-home-dark.png)

[![Netlify Status](https://api.netlify.com/api/v1/badges/96e3f8ad-35c5-4c9a-991b-1d089bc86c72/deploy-status)](https://app.netlify.com/sites/think-ahead-technologies/deploys)
[![License](https://img.shields.io/github/license/think-ahead-technologies/site?style=flat-square&color=dddddd&labelColor=000000)](https://github.com/think-ahead-technologies/site/blob/main/LICENSE.md)
[![Maintained](https://img.shields.io/badge/maintained%3F-yes-brightgreen.svg?style=flat-square)](https://github.com/think-ahead-technologies)
[![Known Vulnerabilities](https://snyk.io/test/github/think-ahead-technologies/site/badge.svg?style=flat-square)](https://snyk.io/test/github/think-ahead-technologies/site)

## Usage

### Prerequisites

-   `node.js v20` and `npm`

### Setup

-   Install the project using npm.
    ```sh
    npm install
    ```
-   Run the local development environment. This will create a server on [localhost:4321](http://localhost:4321/).
    ```sh
    npm run dev
    ```
-   Set up the [pre-commit](.githooks/pre-commit) validation hook.
    ```sh
    (cd .git/hooks && ln -s ../../.githooks/pre-commit pre-commit)
    ```
    -   This hook will check formatting, and ensure no translations are missed.
    -   To fix formatting, run: `npm run format`
    -   To fix translations, manually modify the [English](./public/locales/en/translation.json) and [German](./public/locales/de/translation.json) locale files, then run `npm run i18n:check` to verify nothing has been missed.

### Deployment

The site is deployed automatically on a push to the [`main` branch](https://github.com/think-ahead-technologies/site) (the [primary site](https://think-ahead.tech)) and [`preview` branch](https://github.com/think-ahead-technologies/site/tree/preview) (also viewable [live](https://preview.think-ahead.tech)). The build is run on a [Netlify docker image](https://hub.docker.com/r/netlify/build/tags).

### Images

When resizing images, limiting them to their dimensions on the page (e.g. 768px for an illustration image on the [Who we are](/public/finland.jpg) page), and Quality of 60%. Thus:

```bash
    convert source-image.jpg -resize 768x -quality 60 output-image.jpg
```
