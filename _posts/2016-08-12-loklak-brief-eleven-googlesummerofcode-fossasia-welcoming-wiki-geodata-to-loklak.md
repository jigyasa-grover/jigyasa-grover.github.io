---
layout: post
type: blog
title: "Loklak Brief: ELEVEN #GoogleSummerOfCode #FOSSASIA — “Welcoming Wiki GeoData to Loklak !”"
date: "2016-08-12T05:24:40+00:00"
description: "As Google Summer of Code 2016 has officially begun, I am all excited to be working with FOSSASIA yet again. This time, I have been assigned the project…"
original_url: "https://jigyasagrover.wordpress.com/2016/08/12/loklak-brief-eleven-googlesummerofcode-fossasia-welcoming-wiki-geodata-to-loklak/"
og_image: "/assets/images/wp-archive/2016/banner-gsoc2016_2-61345951.png"
archival: true
noindex: true
sitemap: false
archive_tags: ["FOSSASIA", "Google Summer of Code", "Loklak", "Open Source"]
---

<p><img src="/assets/images/wp-archive/2016/banner-gsoc2016_2-61345951.png" alt="banner-gsoc2016_2" loading="lazy" /></p>
<p class="align-center margin">As <em>Google Summer of Code 2016</em> has officially begun, I am all excited to be working with <em>FOSSASIA</em> yet again. This time, I have been assigned the project <strong>Loklak</strong> where I shall be spending the summer working on implementing indexing (harvester/scrapers) for different services like <a href="http://www.weibo.com/">weibo.com</a>, <a href="https://angel.co/">angel.co</a>, <a href="http://www.meetup.co">meetup.com</a>, <a href="https://www.instagram.com">Instagram</a> etc.</p>
<p class="align-center margin"><a href="http://loklak.org/">Loklak</a> is a server application which is able to collect messages from various sources, including Twitter. This server contains a search index and a peer-to-peer index sharing interface.</p>
<p class="align-center margin">If one likes to be anonymous when searching things, want to archive Tweets or messages about specific topics and if you are looking for a tool to create statistics about Tweet topics, then Loklak is the best option to consider.</p>
<p><img src="/assets/images/wp-archive/2016/loklak_anonymous-c0030999.png" alt="Illustration 2 — Loklak Brief: ELEVEN GoogleSummerOfCode FOSSASIA  Welcoming Wiki GeoData to Loklak" loading="lazy" /></p>
<hr />
<hr />
<h2 class="entry-title"><span>Welcoming Wiki GeoData to Loklak !</span></h2>
<p>&nbsp;</p>
<p><a href="http://loklak.org/"><strong>Loklak</strong></a> has grown vast with due course of time and it&#8217;s capabilities have extended manifold especially by the inclusion of sundry website scraper services and data provider services.</p>
<p><img src="/assets/images/wp-archive/2026/cover-c3565608.jpg" alt="loklak_org_sticker" loading="lazy" /></p>
<p>The recent addition includes a special service which would provide the user with a list of <code>Wikipedia</code> articles tagged with the location when supplied with a specific name of the place.</p>
<p>Thanks to the <strong><a href="https://www.mediawiki.org/wiki/Extension:GeoData">Media Wiki GeoData API</a></strong>, this service was smoothly integrated in the Loklak Server and <strong><em>SUSI</em></strong> (our very own cute and quirky personal digital assistant)</p>
<p>When the name of the <strong><code>place</code></strong> is sent in the query , firstly the <strong><em>home-grown API</em> <a href="http://loklak.org/api.html#geocode"><code>loklak.org/api/geocode.json</code></a></strong> was utilized to get the <strong><em>location co-ordinates</em></strong> i.e. Latitude and Longitude.</p>
<pre><code>
URL getCoordURL = null;

String path = "data={\"places\":[\"" + place + "\"]}";

try {
    getCoordURL = new URL("http://loklak.org/api/geocode.json?" + path);
} catch (MalformedURLException e) {
    e.printStackTrace();
}

JSONTokener tokener = null;
try {
    tokener = new JSONTokener(getCoordURL.openStream());
} catch (Exception e1) {
    e1.printStackTrace();
}

JSONObject obj = new JSONObject(tokener);

String longitude = obj.getJSONObject("locations").getJSONObject(place).getJSONArray("location").get(0)
                .toString();
String lattitude = obj.getJSONObject("locations").getJSONObject(place).getJSONArray("location").get(1)
                .toString();
</code>
</pre>
<p>The resultant geographical co-ordinates were then passed on to the Media Wiki GeoData API with other parameters like the <strong><code>radius of the geographical bound to be considered</code> </strong>and <strong><code>format of the resultant data</code></strong> along-with the <strong><code>co-ordinates</code></strong> to obtain a list of <strong><code>Page IDs</code></strong> of the corresponding Wikipedia Articles besides <strong><code>Title</code></strong> and <strong><code>Distance</code></strong>.</p>
<pre><code>
URL getWikiURL = null;

try {
    getWikiURL = new URL(
                      "https://en.wikipedia.org/w/api.php?action=query&amp;list=geosearch&amp;gsradius=10000&amp;gscoord=" + latitude
            + "|" + longitude + "&amp;format=json");
} catch (MalformedURLException e) {
    e.printStackTrace();
}

JSONTokener wikiTokener = null;

try {
    wikiTokener = new JSONTokener(getWikiURL.openStream());
} catch (Exception e1) {
    e1.printStackTrace();
}

JSONObject wikiGeoResult = new JSONObject(wikiTokener);
</code>
</pre>
<p>When implemented as a <strong><code>Console Service</code></strong> for Loklak, the servlet was registered as <em><strong>/api/wikigeodata.json?place={place-name}</strong></em> and the API endpoint for example goes like <em><strong><a href="http://localhost:9000/api/console.json?q=SELECT * FROM wikigeodata WHERE place='Singapore';">http://localhost:9000/api/console.json?q=SELECT * FROM wikigeodata WHERE place=&#8217;Singapore&#8217;;</a></strong></em></p>
<p><em><strong>Presto !!</strong></em></p>
<p>We have a <em>JSON Object</em> as the result with a list of Wikipedia Articles as:</p>
<p></p>
<p>The <code>Page-IDs</code> thus obtained can now be utilized very easily to diaply the articles by using the placeholder <code>https://en.wikipedia.org/?curid={pageid}</code> for the purpose.</p>
<p>And this way, another facility was included in our diversifying Loklak server.</p>
<p>Questions, feedback, suggestions appreciated 🙂</p>
