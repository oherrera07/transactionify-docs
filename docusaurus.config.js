// @ts-check
const { themes: prismThemes } = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Transactionify',
  tagline: 'Fast, reliable payment and transaction APIs for modern developers.',
  favicon: 'img/favicon.png',

  url: 'https://your-site.github.io',
  baseUrl: '/',

  organizationName: 'your-org',
  projectName: 'transactionify-docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    function devProxyPlugin() {
      return {
        name: 'dev-proxy-plugin',
        configureWebpack() {
          return /** @type {any} */ ({
            devServer: {
              proxy: [
                {
                  context: ['/api-proxy'],
                  target: 'https://gj7edrv1il.execute-api.us-east-1.amazonaws.com',
                  changeOrigin: true,
                  secure: true,
                  pathRewrite: { '^/api-proxy': '' },
                },
              ],
            },
          });
        },
      };
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Transactionify',
        logo: {
          alt: 'Transactionify Logo',
          src: 'img/favicon.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Quickstart',
          },
          {
            to: '/docs/tutorials/make-payment',
            position: 'left',
            label: 'Tutorials',
          },
          {
            to: '/docs/sandbox/api-explorer',
            position: 'left',
            label: 'API Explorer',
          },
          
          {
            href: 'https://dashboard.transactionify.io',
            label: 'Get API Key',
            position: 'right',
            className: 'navbar-cta-button',
          },
        ],
      },

      footer: {
        style: 'light',
        links: [
          {
            title: 'Docs',
            items: [
              { label: 'Quick start',    to: '/docs/getting-started/quickstart' },
              { label: 'Guides',         to: '/docs/tutorials/make-payment' },
              { label: 'API Explorer',  to: '/docs/sandbox/api-explorer' },
              
              
            ],
          },
          {
            title: 'Resources',
            items: [
              { label: 'Changelog', to: '/changelog' },
              { label: 'Status',    href: 'https://status.transactionify.io' },
              { label: 'Support',   href: 'https://support.transactionify.io' },
            ],
          },
          {
            title: 'Company',
            items: [
              { label: 'About',   href: 'https://transactionify.io/about' },
              { label: 'Careers', href: 'https://transactionify.io/careers' },
              { label: 'Contact', href: 'https://transactionify.io/contact' },
              { label: 'Privacy', href: 'https://transactionify.io/privacy' },
              { label: 'Terms',   href: 'https://transactionify.io/terms' },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Transactionify. All rights reserved.`,
      },

      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'json', 'python', 'ruby', 'java'],
      },

      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    }),
};

module.exports = config;
