// @ts-check
const { themes: prismThemes } = require('prism-react-renderer');

/** @type {boolean} */
const isProd = process.env.NODE_ENV === 'production';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Transactionify',
  tagline: 'Fast, reliable payment and transaction APIs for modern developers.',
  favicon: 'img/favicon.png',

  url: 'https://oherrera07.github.io',
  baseUrl: '/transactionify-docs/',

  organizationName: 'oherrera07',
  projectName: 'transactionify-docs',

  deploymentBranch: 'gh-pages',

  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  customFields: {
    apiBase: isProd
      ? 'https://transactionify-proxy.oherrera0704.workers.dev'
      : '/api-proxy',
  }, // 👈 esta llave faltaba

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
              { label: 'Quick start', to: '/docs/getting-started/quickstart' },
              { label: 'Guides',      to: '/docs/tutorials/make-payment' },
              { label: 'API Explorer', to: '/docs/sandbox/api-explorer' },
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