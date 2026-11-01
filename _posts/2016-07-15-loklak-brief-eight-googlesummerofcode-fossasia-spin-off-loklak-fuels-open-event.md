---
layout: post
type: blog
title: "Loklak Brief: EIGHT #GoogleSummerOfCode #FOSSASIA — “Spin-Off: Loklak fuels Open Event”"
date: "2016-07-15T13:29:00+00:00"
description: "As Google Summer of Code 2016 has officially begun, I am all excited to be working with FOSSASIA yet again. This time, I have been assigned the project…"
original_url: "https://jigyasagrover.wordpress.com/2016/07/15/loklak-brief-eight-googlesummerofcode-fossasia-spin-off-loklak-fuels-open-event/"
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
<p><img src="/assets/images/wp-archive/2016/loklak_anonymous-c0030999.png" alt="Illustration 2 — Loklak Brief: EIGHT GoogleSummerOfCode FOSSASIA  Spin-Off: Loklak fuels Open Event" loading="lazy" /></p>
<hr />
<hr />
<h2 class="entry-title"><span>Spin-Off: Loklak fuels Open Event</span></h2>
<h2 class="entry-title"></h2>
<p>Continuing with the Loklak &amp; Open Event Partnership (check out <a href="https://loklaknet.wordpress.com/2016/07/04/loklak-fuels-open-event/">Loklak fuels Open Event</a> ), we can now easily in clicks create our very own web-app for the event with details imported from <a href="http://www.eventbrite.com/">eventbrite.com</a> powered by Loklak.</p>
<p>The scraping of data done using <em>JSoup, Java HTML parsing</em> was explained in the previous post of this series.</p>
<p>Next, a console service was implemented as the single point for information retrieval from various social networks and websites (a post coming for it soon 😉 ) especially for <strong>SUSI</strong> (our very own personal digital assistant, a cute one indeed !)</p>
<p>The <code>JSONArray</code> result of the <code>EventBriteCrawler</code> was set in <code>SusiThought</code>, which is nothing but a piece of data that can be remembered. The structure or the thought can be modelled as a table which may be created using the retrieval of information from elsewhere of the current argument.</p>
<pre><code>
/** Defining SusiThought as a class 
 * which extends JSONObject
 */

public class SusiThought extends JSONObject {

<em><strong>/* details coming soon.... */
</strong></em>
}
</code></pre>
<pre><code>
/** Modifications in EventBriteCrawler
 *  Returning SusiThought instead of 
 * a simple JSONObject/JSONArray.
 */
public static SusiThought crawlEventBrite(String url) {
    ...
    ...    
    SusiThought json = new SusiThought();
    json.setData(jsonArray);
    return json;
}
</code></pre>
<p>The API EndPoint was thus created.<br />
A sample is as: <a href="http://loklak.org/api/console.json?q=SELECT%20*%20FROM%20eventbrite%20WHERE%20url=%27https://www.eventbrite.fr/e/billets-europeade-2016-concert-de-musique-vocale-25592599153?aff=es2%27;">http://loklak.org/api/console.json?q=SELECT * FROM eventbrite WHERE url=&#8217;https://www.eventbrite.fr/e/billets-europeade-2016-concert-de-musique-vocale-25592599153&#8242;;</a></p>
<p></p>
<p>The files generated were next imported in the <a href="http://open-event.herokuapp.com/">Open Event Web App generator</a>, using simple steps.</p>
<p></p>
<p></p>
<p>It&#8217;s amazing to see how a great visual platform is provided to edit details parsed from the plain JSONObject and deploy the personalized web-app !</p>
<p></p>
<p><strong><strong></strong><br />
<br />
Tadaa !</strong> We have our very own event web-app with all the information imported from eventbrite.com in a single (well, very few 😛 ) click (s) !</p>
<p>With this, we conclude the <em>Loklak &#8211; Open Event &#8211; EventBrite series</em>.</p>
<p><em>Stay tuned for detailed post on SUSI and Console Services 🙂</em></p>
<p>&nbsp;</p>
