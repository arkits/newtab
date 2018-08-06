jQuery(function ($) {
  $("#rss-theverge").rss("http://www.theverge.com/rss/index.xml", {
    limit: 7
  })
})

jQuery(function ($) {
  $("#rss-androidpolice").rss("http://feeds.feedburner.com/AndroidPolice", {
    limit: 7
  })
})

jQuery(function ($) {
  $("#rss-ars").rss("http://feeds.arstechnica.com/arstechnica/index/", {
    limit: 7
  })
})