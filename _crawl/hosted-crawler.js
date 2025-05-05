new Crawler({
  schedule: "every 1 day at 2:30 pm",
  appId: "ER08SJMRY1",
  apiKey: "032b4bff3a53999113adec087ecf2efb",
  rateLimit: 8,
  maxDepth: 10,
  startUrls: ["https://docs.starrocks.io/"],
  sitemaps: ["https://docs.starrocks.io/sitemap.xml"],
  ignoreCanonicalTo: true,
  discoveryPatterns: ["https://docs.starrocks.io/**"],
  actions: [
    {
      indexName: "starrocks",
      pathsToMatch: [
        "https://docs.starrocks.io/docs/**",
        "https://docs.starrocks.io/zh/docs/**",
        "https://docs.starrocks.io/zh/releasenotes/**",
        "https://docs.starrocks.io/releasenotes/**",
      ],
      recordExtractor: ({ $, helpers }) => {
        // Extract metadata
        const description = $("meta[name='description']").attr("content") || "";
        const keywords = $("meta[name='keywords']").attr("content") || "";
        const pinyin = $("meta[name='pinyin']").attr("content") || "";
        // Note: Algolia Crawler supports metadata `docsearch:pagerank` out of the
        // box; no extractor or assignment is needed. Just add this to the head:
        // <head><meta name="docsearch:pagerank" content="100"/></head>
        //const pageBoost = $("meta[name='pageBoost']").attr("content") || "0";


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
            lvl1: ["header h1", "article h1"],
            lvl2: "article h2",
            lvl3: "article h3",
            lvl4: "article h4",
            lvl5: "article h5, article td:first-child",
            lvl6: "article h6",
            content: "article p, article li, article td:last-child",
            description: { defaultValue: description },
            keywords: { defaultValue: keywords },
            pinyin: { defaultValue: pinyin },
            // commented out, see earlier comment
            //pageRank: Number(pageBoost),
          },
          indexHeadings: true,
          aggregateContent: true,
          recordVersion: "v3",
        });
      },
    },
  ],
  exclusionPatterns: [
    "https://docs.starrocks.io/docs/assets/**",
    "https://docs.starrocks.io/zh/docs/assets/**",
    "https://docs.starrocks.io/docs/**/assets/**",
    "https://docs.starrocks.io/zh/docs/**/assets/**",
  ],
  initialIndexSettings: {
    starrocks: {
      attributesForFaceting: [
        "type",
        "lang",
        "language",
        "version",
        "docusaurus_tag",
      ],
      attributesToRetrieve: [
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
