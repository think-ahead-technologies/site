import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: "nav.whoweare",
      href: getPermalink(`/who-we-are`),
    },
    {
      text: 'nav.solutions',
      links: [
        { text: 'nav.platform', href: getPermalink('/solutions/platform') },
        { text: 'nav.security', href: getPermalink('/solutions/security') },
        { text: 'nav.training', href: getPermalink('/solutions/training') }
      ]
    },
    // {
    //   text: 'nav.partners',
    //   links: [
    //     {
    //       text: 'TODO',
    //       href: getPermalink('/partners/todo'),
    //     }
    //   ],
    // },
    {
      text: 'nav.blog',
      href: getBlogPermalink(),
    }
  ],
  actions: [{ text: 'Contact', href: '/contact' }],
};

export const footerData = {
  links: [
    {
      title: 'nav.solutions',
      links: [
        { text: 'nav.platform', href: getPermalink('/solutions/cloud') },
        { text: 'nav.security', href: getPermalink('/solutions/security') },
        { text: 'nav.training', href: getPermalink('/solutions/training') },
      ],
    },
    {
        title: 'nav.languages',
        links: [
          { text: 'lang.de', href: getPermalink() },
          { text: 'lang.en', href: getPermalink('/solutions/security') }
        ],
      }
  ],
  secondaryLinks: [
    { text: 'nav.terms', href: getPermalink('/terms') },
    { text: 'nav.privacypolicy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/company/think-ahead-tech/' },
    { ariaLabel: 'GitHub', icon: 'tabler:brand-github', href: 'https://github.com/think-ahead-technologies' },
  ],
  footNote: `nav.footnote`,
};
