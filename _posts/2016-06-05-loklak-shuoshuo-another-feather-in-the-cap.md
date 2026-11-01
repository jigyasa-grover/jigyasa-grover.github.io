---
layout: post
type: blog
title: "Loklak Brief: THREE #GoogleSummerOfCode #FOSSASIA — “Loklak ShuoShuo: Another feather in the cap !”"
date: "2016-06-05T17:26:14+00:00"
description: "As Google Summer of Code 2016 has officially begun, I am all excited to be working with FOSSASIA yet again. This time, I have been assigned the project…"
original_url: "https://jigyasagrover.wordpress.com/2016/06/05/loklak-shuoshuo-another-feather-in-the-cap/"
og_image: "/assets/images/wp-archive/2016/banner-gsoc2016_2-61345951.png"
archival: true
noindex: true
sitemap: false
archive_tags: ["FOSSASIA", "Google Summer of Code", "Loklak", "Open Source"]
---

<p><img src="/assets/images/wp-archive/2016/banner-gsoc2016_2-61345951.png" alt="banner-gsoc2016_2" loading="lazy" /></p>
<p class="align-center margin">As <em>Google Summer of Code 2016</em> has officially begun, I am all excited to be working with <em>FOSSASIA</em> yet again. This time, I have been assigned the project <strong>Loklak</strong> where I shall be spending the summer working on implementing indexing (harvester/scrapers) for different services like <a href="http://www.weibo.com/">weibo.com</a>, <a href="https://angel.co/">angel.co</a>, <a href="http://www.meetup.co">meetup.com</a>, <a href="https://www.instagram.com">Instagram</a> etc.</p>
<p class="align-center margin"><a href="http://loklak.org/">Loklak</a> is a server application which is able to collect messages from various sources, including Twitter. This server contains a search index and a peer-to-peer index sharing interface. If one likes to be anonymous when searching things, want to archive Tweets or messages about specific topics and if you are looking for a tool to create statistics about Tweet topics, then Loklak is the best option to consider.</p>
<p><img src="/assets/images/wp-archive/2016/loklak_anonymous-c0030999.png" alt="Illustration 2 — Loklak Brief: THREE GoogleSummerOfCode FOSSASIA  Loklak ShuoShuo: Another feather in the cap" loading="lazy" /></p>
<hr />
<h2 class="entry-title"><span><a href="https://loklaknet.wordpress.com/2016/06/05/loklak-shuoshuo-another-feather-in-the-cap/" rel="bookmark">LOKLAK SHUOSHUO: ANOTHER FEATHER IN THE CAP !</a></span></h2>
<p>Work is still going on <strong><a href="https://loklaknet.wordpress.com/2016/06/01/loklak-weibo-now-going-beyond-twitter/">Loklak Weibo</a></strong> to extract the information as desired and there shall be another post up soon explaining the intricacies of implementation. Currently, an attempt was made to parse the HTML page of <a href="http://www.qqshuoshuo.com/">QQShuoShuo.com </a> (another Chinese twitter like service)</p>
<p><br />
Just like last time, The major challenge however is to understand the Chinese annotations especially being from a non-Chinese background. Google translate aids testing the retrieved data by helping me match each phrase or/and line.</p>
<p>I have made use of of  <em>JSoup: The Java HTML parser library which assists in </em>extracting and manipulating data, scrape and parse HTML from the URL. The suggested use of <em>JSoup</em> is designed to deal with all varieties of HTML, hence as of now it is being considered a suitable choice.</p>
<p></p>
<pre><code>/**
 *  Shuoshuo Crawler
 *  By Jigyasa Grover, @jig08
 **/

package org.loklak.harvester;

import java.io.IOException;
import org.jsoup.Jsoup;
import org.jsoup.nodes.*;
import org.jsoup.select.Elements;

public class ShuoshuoCrawler {
    public static void main(String args[]){

        Document shuoshuoHTML = null;
        Element recommendedTalkBox = null;
        Elements recommendedTalksList = null;
        String recommendedTalksResult[] = new String[100];
        Integer numberOfrecommendedTalks = 0;
        Integer i = 0;

        try {
            shuoshuoHTML = Jsoup.connect("http://www.qqshuoshuo.com/").get();

            recommendedTalkBox = shuoshuoHTML.getElementById("list2");
            recommendedTalksList = recommendedTalkBox.getElementsByTag("li");

            i=0;
            for (Element recommendedTalks : recommendedTalksList)
            {
                //System.out.println("\nLine: " + recommendedTalks.text());
                recommendedTalksResult[i] = recommendedTalks.text().toString();
                i++;
            }           
            numberOfrecommendedTalks = i;
            System.out.println("Total Recommended Talks: " + numberOfrecommendedTalks);
            for(int k=0; k&lt;numberOfrecommendedTalks; k++){
                System.out.println("Recommended Talk " + k + ": " + recommendedTalksResult[k]);
            }

        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
</code></pre>
<p><code>QQ Recommended Talks</code> from <a href="http://www.qqshuoshuo.com/">qqshuoshuo.com</a> are now stored as an array of Strings.</p>
<pre><code>Total Recommended Talks: 10
Recommended Talk 0: 不会在意无视我的人，不会忘记帮助过我的人，不会去恨真心爱过我的人。
Recommended Talk 1: 喜欢一个人是一种感觉，不喜欢一个人却是事实。事实容易解释，感觉却难以言喻。
Recommended Talk 2: 一个人容易从别人的世界走出来却走不出自己的沙漠
Recommended Talk 3: 有什么了不起，不就是幸福在左边，我站在了右边？
Recommended Talk 4: 希望我跟你的爱，就像新闻联播一样没有大结局
Recommended Talk 5: 你会遇到别的女子和她举案齐眉，而我自会有别的男子与我白首相携。
Recommended Talk 6: 既然爱，为什么不说出口，有些东西失去了，就再也回不来了！
Recommended Talk 7: 凡事都有可能，永远别说永远。
Recommended Talk 8: 都是因为爱，而喜欢上了怀旧；都是因为你，而喜欢上了怀念。
Recommended Talk 9: 爱是老去，爱是新生，爱是一切，爱是你。
</code></pre>
<p>A similar approach can be now used to do the same for <code>Latest QQ talk</code> and <code>QQ talk Leaderboard</code>.</p>
<hr />
<p>Check out this space for upcoming detail on implementing this technique to parse the entire page and get desired results&#8230;</p>
<p>Feedback and Suggestions welcome.</p>
<h2 class="entry-title"></h2>
