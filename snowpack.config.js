/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    mount: {
      public: '/',
      src: '/_dist_',
    },
    plugins: [
      '@snowpack/plugin-react-refresh',
      '@snowpack/plugin-dotenv',
      '@snowpack/plugin-typescript',
      ['@snowpack/plugin-sass', { /* node-sass options */ }],
      ["@snowpack/plugin-optimize", {
        minifyJS: true,
        minifyCSS: true,
        minifyHTML: true,
        preloadModules: true,
        preloadCSS: true,
        target: 'es2015'
      }]
    ],
    install: [
      /* ... */
    ],
    installOptions: {
      treeshake: true
      /* ... */
    },
    devOptions: {
      /* ... */
    },
    buildOptions: {
      out: 'build',
      clean: true,
      sourceMaps: true
      /* ... */
    },
    proxy: {
      /* ... */
    },
    alias: {
      /* ... */
    },
};
