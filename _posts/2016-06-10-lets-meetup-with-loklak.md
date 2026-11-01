---
layout: post
type: blog
title: "Loklak Brief: FOUR #GoogleSummerOfCode #FOSSASIA — “Let’s ‘Meetup’ with Loklak”"
date: "2016-06-10T14:11:48+00:00"
description: "As Google Summer of Code 2016 has officially begun, I am all excited to be working with FOSSASIA yet again. This time, I have been assigned the project…"
original_url: "https://jigyasagrover.wordpress.com/2016/06/10/lets-meetup-with-loklak/"
og_image: "/assets/images/wp-archive/2016/banner-gsoc2016_2-61345951.png"
archival: true
noindex: true
sitemap: false
archive_tags: ["FOSSASIA", "Google Summer of Code", "Loklak", "Open Source"]
---

<p><img src="/assets/images/wp-archive/2016/banner-gsoc2016_2-61345951.png" alt="banner-gsoc2016_2" loading="lazy" /></p>
<p class="align-center margin">As <em>Google Summer of Code 2016</em> has officially begun, I am all excited to be working with <em>FOSSASIA</em> yet again. This time, I have been assigned the project <strong>Loklak</strong> where I shall be spending the summer working on implementing indexing (harvester/scrapers) for different services like <a href="http://www.weibo.com/">weibo.com</a>, <a href="https://angel.co/">angel.co</a>, <a href="http://www.meetup.co">meetup.com</a>, <a href="https://www.instagram.com">Instagram</a> etc.</p>
<p class="align-center margin"><a href="http://loklak.org/">Loklak</a> is a server application which is able to collect messages from various sources, including Twitter. This server contains a search index and a peer-to-peer index sharing interface. If one likes to be anonymous when searching things, want to archive Tweets or messages about specific topics and if you are looking for a tool to create statistics about Tweet topics, then Loklak is the best option to consider.</p>
<p><img src="/assets/images/wp-archive/2016/loklak_anonymous-c0030999.png" alt="Illustration 2 — Loklak Brief: FOUR GoogleSummerOfCode FOSSASIA  Lets Meetup with Loklak" loading="lazy" /></p>
<hr />
<h2 class="entry-title"><span>LET’S ‘MEETUP’ WITH LOKLAK</span></h2>
<p><em><a href="http://loklak.net/">Loklak</a></em> has already started to expand beyond the realms of Twitter and working its way to build an extensive social network. Now, <em><a href="http://loklak.org/">Loklak</a></em> aims to bring in data crawled from <span>meetups.com</span> to create a close-knit community. Chiming together with Meetup&#8217;s mission to revitalize local community and help people around the world self-organize, <em>Loklak</em> strives to revolutionize the social networking scenario of the present world.</p>
<p><br />
</p>
<p>In order to extract information viz. Group Name, Location, Description, Group Topics/Tags, Recent Meetups (Day, Date, Time, RSVP, Reviews, Introductory lines etc.) about a specific group on <span>meetups.com</span> I have used the URL <strong><a href="http://www.meetup.com/&lt;group-name&gt;/" rel="nofollow">http://www.meetup.com/&lt;group-name&gt;/</a> </strong>and then scraped information from the HTML page itself.</p>
<p>Just like previous experiments with other webpages, I have made use of <strong>JSoup: The Java HTML parser library</strong> in the <em>loklak_server</em>. It provides a very convenient API for extracting and manipulating data, scrape and parse HTML from a URL. The suggested use of JSoup is designed to deal with all varieties of HTML, hence as of now it is being considered a suitable choice.</p>
<p>The information scraped is stored in a multi-dimensional array of <code>recentMeetupsResult[][]</code> and then the data inside can be used accordingly.</p>
<p>A sample code-snippet for reference is as:</p>
<pre>/**
 *  Meetups Scraper
 *  By Jigyasa Grover, @jig08
 **/

package org.loklak.harvester;

import java.io.IOException;
import org.jsoup.Jsoup;
import org.jsoup.nodes.*;
import org.jsoup.select.Elements;

public class MeetupsScraper {
    public static void main(String args[]){
        
        Document meetupHTML = null;
        String meetupGroupName = "Women-Who-Code-Delhi";
        // fetch group name here
        Element groupDescription = null;
        String groupDescriptionString = null;
        Element topicList = null;
        Elements topicListStrings = null;
        String[] topicListArray = new String[100];
        Integer numberOfTopics = 0;
        Element recentMeetupsSection = null;
        Elements recentMeetupsList = null;
        Integer numberOfRecentMeetupsShown = 0;
        Integer i = 0, j = 0;
        String recentMeetupsResult[][] = new String[100][3];
        
        // recentMeetupsResult[i][0] == date &amp;&amp; time
        // recentMeetupsResult[i][1] == Attendance &amp;&amp; Review
        // recentMeetupsResult[i][2] == Information
                
        try{
            meetupHTML = Jsoup.connect("http://www.meetup.com/" + meetupGroupName).userAgent("Mozilla)").get();
            
            groupDescription = meetupHTML.getElementById("groupDesc");
            groupDescriptionString = groupDescription.text();
            System.out.println(meetupGroupName + "\n\tGroup Description: \n\t\t" + groupDescriptionString);
            
            topicList = meetupHTML.getElementById("topic-box-2012");
            topicListStrings = topicList.getElementsByTag("a");
            
            int p = 0;
            for(Element topicListStringsIterator : topicListStrings){
                topicListArray[p] = topicListStringsIterator.text().toString();
                p++;
            }
            numberOfTopics = p;
            
            System.out.println("\nGroup Topics:");
            for(int l = 0; l&lt;numberOfTopics; l++){
                System.out.println("\n\tTopic Number "+ l + " : " + topicListArray[l]);
            }
            
            recentMeetupsSection = meetupHTML.getElementById("recentMeetups");
            recentMeetupsList = recentMeetupsSection.getElementsByTag("p");
            
            i = 0;
            j = 0;
            
            for(Element recentMeetups : recentMeetupsList ){                
                if(j%3==0){
                    j = 0;
                    i++;
                }
                
                recentMeetupsResult[i][j] = recentMeetups.text().toString();
                j++;
                
            }
            
            numberOfRecentMeetupsShown = i;
            
            for(int k = 1; k &lt; numberOfRecentMeetupsShown; k++){
                System.out.println("\n\nRecent Meetup Number" + k + " : \n" + 
                        "\n\t Date &amp; Time: " + recentMeetupsResult[k][0] + 
                        "\n\t Attendance: " + recentMeetupsResult[k][1] + 
                        "\n\t Information: " + recentMeetupsResult[k][2]);
            }

        }catch (IOException e) {
            e.printStackTrace();
        }
        
    }
}
</pre>
<p>In this, simply a HTTP Connection was established and <code>text</code> extracted using <code>"element_name".text()</code>from inside the specific tags using identifiers like classes or ids. The tags from which the information was to be extracted were identified after exploring the web page&#8217;s HTML source code.</p>
<p>The above yields results as:</p>
<pre>Women-Who-Code-Delhi
    Group Description: 
        Mission: Women Who Code is a global nonprofit organization dedicated to inspiring women to excel in technology careers by creating a global, connected community of women in technology. The organization tripled in 2013 and has grown to be one of the largest communities of women engineers in the world. Empowerment: Women Who code is a professional community for women in tech. We provide an avenue for women to pursue a career in technology, help them gain new skills and hone existing skills for professional advancement, and foster environments where networking and mentorship are valued. Key Initiatives: - Free technical study groups - Events featuring influential tech industry experts and investors - Hack events - Career and leadership development Current and aspiring coders are welcome.  Bring your laptop and a friend!  Support Women Who Code: Donating to Women Who Code, Inc. (#46-4218859) directly impacts our ability to efficiently run this growing organization, helps us produce new programs that will increase our reach, and enables us to expand into new cities around the world ensuring that women and girls everywhere have the opportunity to pursue a career in technology. Women Who Code (WWCode) is dedicated to providing an empowering experience for everyone who participates in or supports our community, regardless of gender, gender identity and expression, sexual orientation, ability, physical appearance, body size, race, ethnicity, age, religion, or socioeconomic status. Because we value the safety and security of our members and strive to have an inclusive community, we do not tolerate harassment of members or event participants in any form. Our Code of Conduct applies to all events run by Women Who Code, Inc. If you would like to report an incident or contact our leadership team, please submit an incident report form. WomenWhoCode.com

Group Topics:

    Topic Number 0 : Django
    Topic Number 1 : Web Design
    Topic Number 2 : Ruby
    Topic Number 3 : HTML5
    Topic Number 4 : Women Programmers
    Topic Number 5 : JavaScript
    Topic Number 6 : Python
    Topic Number 7 : Women in Technology
    Topic Number 8 : Android Development
    Topic Number 9 : Mobile Technology
    Topic Number 10 : iOS Development
    Topic Number 11 : Women Who Code
    Topic Number 12 : Ruby On Rails
    Topic Number 13 : Computer programming
    Topic Number 14 : WWC

Recent Meetup Number1 : 
     Date &amp; Time: April 2 · 10:30 AM
     Attendance: 13 Women Who Code-rs | 5.001
     Information: Brought to you in collaboration with Women Techmakers Delhi.According to a survey, only 11% of open source participants are women. People find it intimidating to get... Learn more


Recent Meetup Number2 : 
     Date &amp; Time: March 3 · 3:00 PM
     Attendance: 21 Women Who Code-rs | 5.001
     Information: “Behold, the number five is at hand. Grab it and shake and harness the power of networking.” Women Who Code Delhi is proud to present Social Hack Eve, a networking... Learn more


Recent Meetup Number3 : 
     Date &amp; Time: Oct 18, 2015 · 9:00 AM
     Attendance: 20 Women Who Code-rs | 4.502
     Information: Hello Ladies :) Google Women Techmakers is looking for women techies to present a talk in one of the segments of Google DevFest Delhi 2015 planned for October 18, 2015... Learn more


Recent Meetup Number4 : 
     Date &amp; Time: Jul 5, 2015 · 12:00 PM
     Attendance: 24 Women Who Code-rs | 4.001 | 1 Photo
     Information: Agenda: Learning how to use and develop open source software, and contribute to huge existing open source projects.A series of talks by some of this year’s GSoC... Learn more
</pre>
<p>In this sample, simply text has been retrieved . Advanced versions could include the hyperlinks and multimedia embedded in the web-page and integrating the extracted information in a suitable format.</p>
<hr />
<p>Check out this space for more details and implementation details of crawlers.<br />
Feedback and Suggestions welcome.</p>
<h2 class="entry-title"></h2>
