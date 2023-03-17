const nextTranslate = require('next-translate-plugin');
const fs = require('fs');
const permalinks = require('./permalinks.json');

/**
 * 
 * Transforms
{
  "/": {
    "fr": "/accueil"
  }
}
 * into
[
  {
    source: '/fr/accueil',
    destination: '/fr',
    locale: false
  }
]
*/
const permalinksToRewriteRules = (permalinks) =>
  Object.entries(permalinks).reduce(
    (acc, [originalSlug, permalinks]) => [
      ...acc,
      ...Object.entries(permalinks).reduce(
        (acc2, [locale, i18nSlug]) => [
          ...acc2,
          {
            source: `/${locale}${i18nSlug}`,
            destination: `/${locale}${originalSlug}`,
            locale: false,
          },
        ],
        []
      ),
    ],
    []
  );

module.exports = (nextConfig) => {
  const nextTranslateConfig = nextTranslate(nextConfig);

  return {
    ...nextTranslateConfig,
    publicRuntimeConfig: {
      ...nextTranslateConfig.publicRuntimeConfig,
      permalinks, // add it to publicRuntimeConfig so it can be used by the Link component
    },
    async rewrites() {
      const existingRewrites = nextTranslateConfig.rewrites
        ? await nextTranslateConfig.rewrites()
        : [];
      return [...permalinksToRewriteRules(permalinks), ...existingRewrites];
    },
  };
};
