---
layout: post
type: blog
title: "Loklak Brief: FIVE #GoogleSummerOfCode #FOSSASIA — “Loklak gives some hackernews now !”"
date: "2016-06-17T03:58:05+00:00"
description: "As Google Summer of Code 2016 has officially begun, I am all excited to be working with FOSSASIA yet again. This time, I have been assigned the project…"
original_url: "https://jigyasagrover.wordpress.com/2016/06/17/loklak-gives-some-hackernews-now/"
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
<p><img src="/assets/images/wp-archive/2016/loklak_anonymous-c0030999.png" alt="Illustration 2 — Loklak Brief: FIVE GoogleSummerOfCode FOSSASIA  Loklak gives some hackernews now" loading="lazy" /></p>
<hr />
<hr />
<h2 class="entry-title"><span>LOKLAK GIVES SOME HACKERNEWS NOW !</span></h2>
<p>It&#8217;s been befittingly said  <em>&#8220;Well, news is anything that&#8217;s interesting, that relates to what&#8217;s happening in the world, what&#8217;s happening in areas of the culture that would be of interest to your audience.&#8221; </em>by Kurt Loder, the famous American Journalist.</p>
<p>And what better than <span><strong>Hackernews : <a href="https://news.ycombinator.com/">news.ycombinator.com</a></strong></span> for the tech community. It helps community by showing the important and latest buzz and sort them by popularity and their links.</p>
<p></p>
<p><strong>LOKLAK</strong> next tried to include this important piece of information in its server by collecting data from this source. Instead of the usual scraping of HTML Pages we had been doing for other sources before, we have tried to read the RSS stream instead.</p>
<p>Simply put, RSS (Really Simple Syndication) uses a family of standard web feed formats to publish frequently updated information: blog entries, news headlines, audio, video. A standard XML file format ensures compatibility with many different machines/programs. RSS feeds also benefit users who want to receive timely updates from favorite websites or to aggregate data from many sites without signing-in and all.</p>
<p><em>Hackernews RSS Feed</em> can be fetched via the URL <a href="https://news.ycombinator.com/rss">https://news.ycombinator.com/rss</a> and looks something like&#8230;</p>
<p></p>
<p>In order to keep things simple, I decided to use the <strong><a href="https://rometools.github.io/rome/">ROME Framework</a></strong> to make a RSS Reader for <em>Hackernews</em> for <em>Loklak</em>.</p>
<blockquote><p>Just for a quick introduction, <em>ROME</em> is a Java framework for RSS and Atom feeds. It&#8217;s open source and licensed under the Apache 2.0 license. ROME includes a set of parsers and generators for the various flavors of syndication feeds, as well as converters to convert from one format to another. The parsers can give you back Java objects that are either specific for the format you want to work with, or a generic normalized <em>SyndFeed</em> class that lets you work on with the data without bothering about the incoming or outgoing feed type.</p></blockquote>
<p>So, I made a function <span><code>hackernewsRSSReader</code></span> which basically returns us a <span><code>JSONObject</code> </span>of <span><code>JSONArray</code></span> &#8220;Hackernews RSS Feed[]&#8221; having <span><code>JSONObjects</code></span> each of which represents a &#8216;news headline&#8217; from the source.</p>
<p>The structure of the <span><code>JSONObject</code></span> result obtained is something like:<br />
<code></code></p>
<pre>{
   "Hackernews RSS Feed":[
      {
         "Description":"SyndContentImpl.value=....",
         "Updated-Date":"null",
         "Link":"http://journals.aps.org/prl/abstract/10.1103/PhysRevLett.116.241103",
         "RSS Feed":"https://news.ycombinator.com/rss",
         "Published-Date":"Wed Jun 15 13:30:33 EDT 2016",
         "Hash-Code":"1365366114",
         "Title":"Second Gravitational Wave Detected at LIGO",
         "URI":"http://journals.aps.org/prl/abstract/10.1103/PhysRevLett.116.241103"
      },
     ......
      {
         "Description":"SyndContentImpl.value=....",
         "Updated-Date":"null",
         "Link":"http://ocw.mit.edu/courses/aeronautics-and-astronautics/16-410-principles-of-autonomy-and-decision-making-fall-2010/lecture-notes/MIT16_410F10_lec20.pdf",
         "RSS Feed":"https://news.ycombinator.com/rss",
         "Published-Date":"Wed Jun 15 08:37:36 EDT 2016",
         "Hash-Code":"1649214835",
         "Title":"Intro to Hidden Markov Models (2010) [pdf]",
         "URI":"http://ocw.mit.edu/courses/aeronautics-and-astronautics/16-410-principles-of-autonomy-and-decision-making-fall-2010/lecture-notes/MIT16_410F10_lec20.pdf"
      }
   ]
}</pre>
<p>It includes information like Title, Link, HashCode, Published Date, Updated Date, URI and the Description of each &#8220;news headline&#8221;.</p>
<p>The next step after extracting information is to write it to the back-end and then retrieve it whenever required and display it in the desired format as suitable to the <em>Loklak Web Client </em>after parsing it.</p>
<p>It requires <code>JDOM</code> and <code>ROME</code> jars to be configured into the build path before proceeding with implementation of the RSS Reader.</p>
<p>A look through the code for the <code>HackernewsRSSReader.java</code> :<br />
<code></code></p>
<pre>/**
 *  Hacker News RSS Reader
 *  By Jigyasa Grover, @jig08
 **/

package org.loklak.harvester;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONObject;
import com.sun.syndication.feed.synd.SyndEntry;
import com.sun.syndication.feed.synd.SyndFeed;
import com.sun.syndication.io.SyndFeedInput;
import com.sun.syndication.io.XmlReader;

public class HackernewsRSSReader {  
    
    /*
     * For HackernewsRSS, simply pass URL: https://news.ycombinator.com/rss 
     * in the function to obtain a corresponding JSON
     */
    @SuppressWarnings({ "unchecked", "static-access" })
    public static JSONObject hackernewsRSSReader(String url){
         
            URL feedUrl = null;
            try {
                feedUrl = new URL(url);
            } catch (MalformedURLException e) {
                e.printStackTrace();
            }
            
            SyndFeedInput input = new SyndFeedInput();
            
            SyndFeed feed = null;
            try {
                feed = input.build(new XmlReader(feedUrl));
            } catch (Exception e) {
                e.printStackTrace();
            }
            
            String[][] result = new String[100][7];
            //result[][0] = Title
            //result[][1] = Link
            //result[][2] = URI
            //result[][3] = Hash Code
            //result[][4] = PublishedDate
            //result[][5] = Updated Date
            //result[][6] = Description
            
            @SuppressWarnings("unused")
            int totalEntries = 0;
            int i = 0;
            
            JSONArray jsonArray = new JSONArray();
            
            for (SyndEntry entry : (List)feed.getEntries()) {
                
                result[i][0] = entry.getTitle().toString();
                result[i][1] = entry.getLink().toString();
                result[i][2] = entry.getUri().toString();
                result[i][3] = Integer.toString(entry.hashCode()); 
                result[i][4] = entry.getPublishedDate().toString();
                result[i][5] = ( (entry.getUpdatedDate() == null) ? ("null") : (entry.getUpdatedDate().toString()) );
                result[i][6] = entry.getDescription().toString();
                
                JSONObject jsonObject = new JSONObject();

                jsonObject.put("RSS Feed", url);
                jsonObject.put("Title", result[i][0]);
                jsonObject.put("Link", result[i][1]);
                jsonObject.put("URI", result[i][2]);
                jsonObject.put("Hash-Code", result[i][3]);
                jsonObject.put("Published-Date", result[i][4]);
                jsonObject.put("Updated-Date", result[i][5]);
                jsonObject.put("Description", result[i][6]);
                
                jsonArray.put(i, jsonObject);
                
                i++;
            }
            
            totalEntries = i;
            
        JSONObject rssFeed = new JSONObject();
        rssFeed.put("Hackernews RSS Feed", jsonArray);
        System.out.println(rssFeed);
        return rssFeed;
        
    }

}
</pre>
<p>Feel free to ask questions regarding the above code snippet.</p>
<p>Also, Stay tuned for more posts on data crawling and parsing for Loklak.</p>
<p>Feedback and Suggestions welcome 🙂</p>
<p>&nbsp;</p>
