# Algolia crawler info

These files are not sourced from GitHub, we  just copy them from Algolia's web interface and save them here.

Do not expose the file `hosted-crawler.js` in a public GitHub or any other
system as it contains the write key for our index and this can be used to delete the index etc.

The file `export-starrocks-ER08SJMRY1-1709829215.json` (or similar name) has the settings that specify the fields that we search in, and the ranking. For example, these lines influence the attributes that are searched. We added the `keywords` attribute so that we can add extra information the docs (like Pinyin terms). For us, the words in the title (H1) are generally the most important term. The Algolia parameter name for title is `hierarchy.lvl1`:

```json
    "searchableAttributes": [
      "unordered(hierarchy.lvl1)",
      "unordered(hierarchy.lvl2)",
      "unordered(keywords)",
```

This section configures ranking of the results. Proximity is at the top of the list here, this is because many of the SQL commands are multi-word, so searching for "BROKER LOAD", or "CREATE TABLE" is very different from searching for one of the individual words. Possibly `typo` in the list below needs to be moved down in the list as people searching for terms related to a database will probably get the spelling correct.

```json
    "ranking": [
      "proximity",
      "words",
      "filters",
      "typo",
      "attribute",
      "exact",
      "custom"
    ],
```

These two scripts are for pulling the search info from Algolia. See the weekly report CI job in github.com/starrocks/starrocks for use and reports.

- topSearches.sh
- zeroResults.sh
