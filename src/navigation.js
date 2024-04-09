import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

// import { getLangFromUrl, useTranslations } from "./i18n/utils";
// const lang = getLangFromUrl(Astro.url);
// const t = useTranslations(lang);

export const headerData = {
  links: [
    {
      text: "nav.about",
      href: getPermalink(`/who-we-are`),
    },
    {
      text: 'Our solutions',
      links: [
        { text: 'Platform & Cloud', href: getPermalink('/solutions/cloud') },
        { text: 'Security & Compliance', href: getPermalink('/solutions/security') },
        { text: 'Training & Workshops', href: getPermalink('/solutions/training') }
      ]
    },
    // {
    //   text: 'Partners',
    //   links: [
    //     {
    //       text: 'TODO',
    //       href: getPermalink('/partners/todo'),
    //     }
    //   ],
    // },
    {
      text: 'Our insights',
      href: getBlogPermalink(),
    }
  ],
  actions: [{ text: 'Contact', href: '/contact' }],
};

export const footerData = {
  links: [
    {
      title: 'Services',
      links: [
        { text: 'Platform & Cloud', href: getPermalink('/solutions/cloud') },
        { text: 'Security & Compliance', href: getPermalink('/solutions/security') },
        { text: 'Training & Workshops', href: getPermalink('/solutions/training') },
      ],
    }
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/company/think-ahead-tech/' },
    { ariaLabel: 'GitHub', icon: 'tabler:brand-github', href: 'https://github.com/Think-Ahead-Technologies' },
  ],
  footNote: `
    Copyright © <span class="dark:text-muted"> Think Ahead Technologies GmbH</span> 2024 · All rights reserved.
  `,
};
