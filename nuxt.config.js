export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  env: {
    baseURL: (process.env.NODE_ENV === 'production' ? 'https://coupdefoudre-kia-niro.com/' : 'http://localhost:3000')
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Kia France | Nouveau Niro',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
      { hid: 'description', name: 'description', content: 'Le nouveau Kia Niro est le seul crossover familial disponible en trois motorisations (hybride, hybride rechargeable, 100 électrique), découvrez grâce à ce site laquelle est faite pour vous.' },
      { name: 'format-detection', content: 'telephone=no' },
      ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [ "~assets/styles/global.scss",],
  pageTransition: {
    mode: 'out-in'
  },
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
   plugins: ['~/plugins/openPopinML.js'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    "@nuxtjs/svg",
    '@nuxtjs/device'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    ['nuxt-vue-select', { /* option */ }],
    ['nuxt-cookie-control',{
      controlButton: false,
    }]
  ],
  cookies: {
    colors: {
      modalBackground: '#697279',
      checkboxDisabledBackground: '#ddd',
      checkboxActiveCircleBackground: '#00c58e',
      checkboxInactiveCircleBackground: '#f44336',
      checkboxDisabledCircleBackground: '#fff',
    },
    necessary: [
      {
        name: {
          fr: 'Cookies par défault'
        },
        description: {
          fr: 'Utilisés pour la gestion des cookies et pour assurer le bon fonctionnement du site.'
        },
        cookies: ['cookie_control_enabled_cookies', 'cookie_control_consent', 'twoCars', 'exitIntentShown', 'tutoShown', 'match']
      }
    ],
    optional: [
      {
        name: {fr: 'Google Analitycs'},
        identifier: 'ga',
        description: {fr: 'Google Analytics est un service d\'analyse de trafic et de statistiques proposé par Google.'},
        initialState: false,
        src:  'https://www.googletagmanager.com/gtag/js?id=G-J6FT00B7LM',
        async:  true,
        cookies: ['_ga', '_gat', '_gid'],
        accepted: () =>{
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
          });
        },
        declined: () =>{

        }
      }
    ]
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: 'https://www.insightondemand.fr',
    withCredentials: true,
    retry: { retries: 2 },
    headers: {

    }
  },


  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
