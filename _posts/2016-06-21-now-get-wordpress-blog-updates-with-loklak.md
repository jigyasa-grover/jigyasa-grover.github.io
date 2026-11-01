---
layout: post
type: blog
title: "Loklak Brief: SIX #GoogleSummerOfCode #FOSSASIA — “Now get wordpress blog updates with Loklak !”"
date: "2016-06-21T23:41:11+00:00"
description: "As Google Summer of Code 2016 has officially begun, I am all excited to be working with FOSSASIA yet again. This time, I have been assigned the project…"
original_url: "https://jigyasagrover.wordpress.com/2016/06/21/now-get-wordpress-blog-updates-with-loklak/"
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
<p><img src="/assets/images/wp-archive/2016/loklak_anonymous-c0030999.png" alt="Illustration 2 — Loklak Brief: SIX GoogleSummerOfCode FOSSASIA  Now get wordpress blog updates with Loklak" loading="lazy" /></p>
<hr />
<hr />
<h2 class="entry-title"><span>NOW GET WORDPRESS BLOG UPDATES WITH LOKLAK !</span></h2>
<p>&nbsp;</p>
<p><span><a href="http://loklak.org/"><strong>Loklak</strong></a> </span>shall soon be spoiling its users !</p>
<p>Next, it will be bringing in tiny tweet-like cards showing the blog-posts (title, publishing date, author and content) from the given <span>WordPress Blog URL</span>.</p>
<p>This feature is certain to expand the realm of Loklak&#8217;s missive of building a comprehensive and an extensive social network dispensing useful information.</p>
<p></p>
<p>In order to implement this feature, I have again made the use of <span><strong>JSoup:</strong> </span><strong><span>The Java HTML parser library</span> </strong>as it provides a very convenient API for extracting and manipulating data, scrape and parse HTML from a URL.</p>
<p>The information is scraped making use of <em>JSoup</em> after the corresponding URL in the format <span><strong><code>"https://[username].wordpress.com/"</code></strong></span> is passed as an argument to the function <span><em><code>scrapeWordpress(String blogURL){..}</code></em></span> which returns a <span><code><em>JSONObject</em></code></span> as the result.</p>
<p>A look at the code snippet :</p>
<pre><code>/**
 *  WordPress Blog Scraper
 *  By Jigyasa Grover, @jig08
 **/

package org.loklak.harvester;

import java.io.IOException;

import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class WordPressBlogScraper {
    public static void main(String args[]){
        
        String blogURL = "https://loklaknet.wordpress.com/";
        scrapeWordpress(blogURL);       
    }
    
    public static JSONObject scrapeWordpress(String blogURL) {
        
                Document blogHTML = null;
        
        Elements articles = null;
        Elements articleList_title = null;
        Elements articleList_content = null;
        Elements articleList_dateTime = null;
        Elements articleList_author = null;

        String[][] blogPosts = new String[100][4];
        
        //blogPosts[][0] = Blog Title
        //blogPosts[][1] = Posted On
        //blogPosts[][2] = Author
        //blogPosts[][3] = Blog Content
        
        Integer numberOfBlogs = 0;
        Integer iterator = 0;
        
        try{            
            blogHTML = Jsoup.connect(blogURL).get();
        }catch (IOException e) {
            e.printStackTrace();
        }
            
            articles = blogHTML.getElementsByTag("article");
            
            iterator = 0;
            for(Element article : articles){
                
                articleList_title = article.getElementsByClass("entry-title");              
                for(Element blogs : articleList_title){
                    blogPosts[iterator][0] = blogs.text().toString();
                }
                
                articleList_dateTime = article.getElementsByClass("posted-on");             
                for(Element blogs : articleList_dateTime){
                    blogPosts[iterator][1] = blogs.text().toString();
                }
                
                articleList_author = article.getElementsByClass("byline");              
                for(Element blogs : articleList_author){
                    blogPosts[iterator][2] = blogs.text().toString();
                }
                
                articleList_content = article.getElementsByClass("entry-content");              
                for(Element blogs : articleList_content){
                    blogPosts[iterator][3] = blogs.text().toString();
                }
                
                iterator++;
                
            }
            
            numberOfBlogs = iterator;
            
            JSONArray blog = new JSONArray();
            
            for(int k = 0; k&lt;numberOfBlogs; k++){
                JSONObject blogpost = new JSONObject();
                blogpost.put("blog_url", blogURL);
                blogpost.put("title", blogPosts[k][0]);
                blogpost.put("posted_on", blogPosts[k][1]);
                blogpost.put("author", blogPosts[k][2]);
                blogpost.put("content", blogPosts[k][3]);
                blog.put(blogpost);
            }           
            
            JSONObject final_blog_info = new JSONObject();
            
            final_blog_info.put("Wordpress blog: " + blogURL, blog);            

            System.out.println(final_blog_info);
            
            return final_blog_info;
        
    }
}
</code></pre>
<p>&nbsp;</p>
<p>In this, simply a HTTP Connection was established and text extracted using <span>&#8220;element_name&#8221;.text() </span>from inside the specific tags using identifiers like classes or ids. The tags from which the information was to be extracted were identified after exploring the web page’s HTML source code.</p>
<p>The result thus obtained is in the form of a JSON Object</p>
<pre><code>{
  "Wordpress blog: https://loklaknet.wordpress.com/": [
    {
      "posted_on": "June 19, 2016",
      "blog_url": "https://loklaknet.wordpress.com/",
      "author": "shivenmian",
      "title": "loklak_depot \u2013 The Beginning: Accounts (Part 3)",
      "content": "So this is my third post in this five part series on loklak_depo... As always, feedback is duly welcome."
    },
    {
      "posted_on": "June 19, 2016",
      "blog_url": "https://loklaknet.wordpress.com/",
      "author": "sopankhosla",
      "title": "Creating a Loklak App!",
      "content": "Hello everyone! Today I will be shifting from course a...ore info refer to the full documentation here. Happy Coding!!!"
    },
    {
      "posted_on": "June 17, 2016",
      "blog_url": "https://loklaknet.wordpress.com/",
      "author": "leonmakk",
      "title": "Loklak Walls Manual Moderation \u2013 tweet storage",
      "content": "Loklak walls are going to....Stay tuned for more updates on this new feature of loklak walls!"
    },
    {
      "posted_on": "June 17, 2016",
      "blog_url": "https://loklaknet.wordpress.com/",
      "author": "Robert",
      "title": "Under the hood: Authentication (login)",
      "content": "In the second post of .....key login is ready."
    },
    {
      "posted_on": "June 17, 2016",
      "blog_url": "https://loklaknet.wordpress.com/",
      "author": "jigyasa",
      "title": "Loklak gives some hackernews now !",
      "content": "It's been befittingly said  \u... Also, Stay tuned for more posts on data crawling and parsing for Loklak. Feedback and Suggestions welcome"
    },
    {
      "posted_on": "June 16, 2016",
      "blog_url": "https://loklaknet.wordpress.com/",
      "author": "Damini",
      "title": "Does tweets have emotions?",
      "content": "Tweets do intend some kind o...t of features: classify(feat1,\u2026,featN) = argmax(P(cat)*PROD(P(featI|cat)"
    },
    {
      "posted_on": "June 15, 2016",
      "blog_url": "https://loklaknet.wordpress.com/",
      "author": "sudheesh001",
      "title": "Dockerize the loklak server and publish docker images to IBM Containers on Bluemix Cloud",
      "content": "Docker is an open source...nd to create and deploy instantly as well as scale on demand."
    }
  ]
}</code></pre>
<p>&nbsp;</p>
<p>The next step now would include <span><code>"writeToBackend"</code></span>-ing and then parsing the <span><code>JSONObject</code></span> as desired.</p>
<p>Feel free to ask questions regarding the above code snippet, shall be happy to assist.</p>
<p>Feedback and Suggestions welcome 🙂</p>
