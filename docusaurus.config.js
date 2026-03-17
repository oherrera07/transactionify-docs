// @ts-check
const { themes: prismThemes } = require('prism-react-renderer');

/** @type {boolean} */
const isProd = process.env.NODE_ENV === 'production';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Transactionify',
  tagline: 'Fast, reliable payment and transaction APIs for modern developers.',
  favicon: 'img/favicon.ico',

  url: 'https://oherrera07.github.io',
  baseUrl: '/transactionify-docs/',

  organizationName: 'oherrera07',
  projectName: 'transactionify-docs',

  deploymentBranch: 'gh-pages',

  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  customFields: {
    apiBase: isProd
      ? 'https://transactionify-proxy.oherrera0704.workers.dev'
      : '/api-proxy',
  }, 

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
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

  plugins: /** @type {import('@docusaurus/types').PluginConfig[]} */ [
    ...(!isProd ? [function devProxyPlugin() {
      return {
        name: 'dev-proxy-plugin',
        configureWebpack() {
          return /** @type {any} */ ({
            devServer: {
              proxy: [{
                context: ['/api-proxy'],
                target: 'https://gj7edrv1il.execute-api.us-east-1.amazonaws.com',
                changeOrigin: true,
                secure: true,
                pathRewrite: { '^/api-proxy': '' },
              }],
            },
          });
        },
      };
    }] : []),
  ],

  themeConfig:
    ({
      navbar: {
        logo: {
          alt: 'Transactionify Logo',
          src: 'img/logo.svg',
          srcDark: 'img/logo-dark.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Quickstart',
          },
          {
        type: 'dropdown',
        label: 'Tutorials',
        position: 'left', // or 'right'
        items: [
          {
            label: 'Make Payment',
            href: '/docs/tutorials/make-payment',
          },
          {
            label: 'Check Balance',
            href: '/docs/tutorials/check-balance',
          },
          {
            label: 'Transaction History',
            href: '/docs/tutorials/transaction-history',
          },
        ],
      },
          {
            to: '/docs/sandbox/api-explorer',
            position: 'left',
            label: 'API Explorer',
          },
          {
            to: '/docs/arch-overview/architecture',
            position: 'left',
            label: 'Architecture',
          },
          {
            to: '/docs/internal-docs/engineering-guide',
            position: 'left',
            label: 'Internal Guide',
          },
          {
        type: 'dropdown',
        label: 'Downloads',
        position: 'left', // or 'right'
        items: [
          {
            label: 'Postman Collection',
            href: '/files/postman_collection.json',
            target: '_blank',
            rel: 'noopener noreferrer'
          },
          {
            label: 'Postman Environment',
            href: '/files/postman_environment.json',
            target: '_blank',
            rel: 'noopener noreferrer'
          },
        ],
      },
        ],
      },

      footer: {
        style: 'light',
        links: [
          {
            title: 'Try It Out',
            items: [
              { label: 'Sandbox', href: '/docs/sandbox/api-explorer'}
            ]
          },
          {
            title: 'Docs',
            items: [
              { label: 'Quick start', to: '/docs/getting-started/quickstart' },
              { label: 'Guides',      to: '/docs/tutorials/make-payment' },
              { label: 'API Explorer', to: '/docs/sandbox/api-explorer' },
              { label: 'Architecture', to: '/docs/arch-overview/architecture' },
              { label: 'Internal Guide', to: '/docs/internal-docs/engineering-guide' },
            ],
          },
          {
            title: 'Downloads',
            items: [
              { label: 'Postman Collection', href: '/files/postman_collection.json', target: '_blank', },
              { label: 'Postman Environment',      href: '/files/postman_environment.json', target: '_blank', },
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