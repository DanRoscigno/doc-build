new Crawler({
  appId: "NHCE31YG9M",
  apiKey: "263097dca0cf7e5b557d36bc7e1df497",
  rateLimit: 8,
  maxDepth: 10,
  startUrls: ["https://docs.galacticbase.com/"],
  sitemaps: ["https://docs.galacticbase.com/sitemap.xml"],
  ignoreCanonicalTo: true,
  discoveryPatterns: ["https://docs.galacticbase.com/**"],
  actions: [
    {
      indexName: "galacticbase",
      pathsToMatch: ["https://docs.galacticbase.com/**"],
      recordExtractor: ({ $, helpers }) => {
        // get the description metadata
        const description = $("meta[name='description']").attr("content") || "";
        const keywords = $("meta[name='keywords']").attr("content") || "";
        const pinyin = $("meta[name='pinyin']").attr("content") || "";

        // priority order: deepest active sub list header -> navbar active item -> 'Documentation'
        const lvl0 =
          $(
            ".menu__link.menu__link--sublist.menu__link--active, .navbar__item.navbar__link--active",
          )
            .last()
            .text() || "Documentation";

        return helpers.docsearch({
          recordProps: {
            lvl0: {
              selectors: "",
              defaultValue: lvl0,
            },
            lvl1: ["keywords", "header h1", "article h1"],
            lvl2: "article h2",
            lvl3: "article h3",
            lvl4: "article h4",
            lvl5: "article h5, article td:first-child",
            lvl6: "article h6",
            content: "article p, article li, article td:last-child",
            description: { defaultValue: description },
            keywords: { defaultValue: keywords },
            pinyin: { defaultValue: pinyin },
          },
          indexHeadings: true,
          aggregateContent: true,
          recordVersion: "v3",
        });
      },
    },
  ],
  initialIndexSettings: {
    galacticbase: {
      attributesForFaceting: [
        "type",
        "lang",
        "language",
        "version",
        "docusaurus_tag",
      ],
      attributesToRetrieve: [
        "keywords",
        "hierarchy",
        "content",
        "anchor",
        "url",
        "url_without_anchor",
        "type",
      ],
      attributesToHighlight: ["hierarchy", "content"],
      attributesToSnippet: ["content:10"],
      camelCaseAttributes: ["hierarchy", "content"],
      searchableAttributes: [
        "unordered(keywords)",
        "unordered(description)",
        "unordered(pinyin)",
        "unordered(hierarchy.lvl0)",
        "unordered(hierarchy.lvl1)",
        "unordered(hierarchy.lvl2)",
        "unordered(hierarchy.lvl3)",
        "unordered(hierarchy.lvl4)",
        "unordered(hierarchy.lvl5)",
        "unordered(hierarchy.lvl6)",
        "content",
      ],
      distinct: true,
      attributeForDistinct: "url",
      customRanking: [
        "desc(weight.pageRank)",
        "desc(weight.level)",
        "asc(weight.position)",
      ],
      ranking: [
        "words",
        "filters",
        "typo",
        "attribute",
        "proximity",
        "exact",
        "custom",
      ],
      highlightPreTag: '<span class="algolia-docsearch-suggestion--highlight">',
      highlightPostTag: "</span>",
      minWordSizefor1Typo: 3,
      minWordSizefor2Typos: 7,
      allowTyposOnNumericTokens: false,
      minProximity: 1,
      ignorePlurals: true,
      advancedSyntax: true,
      attributeCriteriaComputedByMinProximity: true,
      removeWordsIfNoResults: "allOptional",
      separatorsToIndex: "_",
    },
  },
});
