---
layout: post
type: blog
title: "searchQuick Apprise: EIGHT #GoogleSummerOfCode #FOSSASIA"
date: "2015-08-29T06:18:16+00:00"
description: "The intended “ searchQuick” (sQuick) is an application to enable a user to search a set of books or texts, like an encyclopedia, or some other topical…"
original_url: "https://jigyasagrover.wordpress.com/2015/08/29/searchquick-apprise-eight-googlesummerofcode-fossasia/"
og_image: "/assets/images/wp-archive/2015/banner-gsoc2015-pagespeed-ce-1-xg35qq3r8sqj5dggl9-b1e73987.png"
archival: true
noindex: true
sitemap: false
archive_tags: ["FOSSASIA", "Google Summer of Code", "Open Source", "Pharo Smalltalk"]
---

<p><img src="/assets/images/wp-archive/2015/banner-gsoc2015-pagespeed-ce-1-xg35qq3r8sqj5dggl9-b1e73987.png" alt="banner-gsoc2015.png.pagespeed.ce.1-XG35qq3R8SQJ5DGgL9" loading="lazy" /></p>
<p>The intended <strong>“</strong><strong>searchQuick” (sQuick)</strong> is an application to enable a user to search a set of books or texts, like an encyclopedia, or some other topical book collection offline built in the open source platform Pharo 4.0.</p>
<p><img src="/assets/images/wp-archive/2015/header-046c16eb.png" alt="header" loading="lazy" /></p>
<hr />
<p>Bringing up to the rear of the summers, the project was brought to a penultimate stage by achieving the following tasks:</p>
<ul>
<li>Handling empty string searches by raising error pop ups.<br />
</p>
<pre><code><strong>searchButtonClicked</strong>
searchBar accept .
(myString isEmptyOrNil  ) 
ifTrue: [self errorPopUp ] 
ifFalse: [ 
     myString := searchBar getText asString .
          self printSearchResults
               ] .</code></pre>
</li>
<p></p>
<li>Adding <em>Help</em>, <em>About</em> and <em>Feedback</em> sections to give an authentic application look and required details to an interested developer.</li>
<p></p>
<li>Inserting <strong>ScrollPane</strong> for <strong>BrowseFile</strong> list menu<br />
</p>
<pre><code>browseScroll := ScrollPane new.
browseScroll scroller addMorph: browse.</code></pre>
</li>
<p></p>
<li>Truncating <strong>BrowseFile</strong> list menu file titles to have their extent within the #<em>MenuMorph</em>: boundary<br />
</p>
<pre><code><code>title := anObject truncateWithElipsisTo: 25.</code> </code></pre>
</li>
<p></p>
<li>Removal of OK/CANCEL buttons from the Search results accordion widget<br />
</p>
<pre><code>dialog buttons: {}.</code></pre>
</li>
<p></p>
<li>Implementation of a <strong>Search Bar</strong> for searching via Search results accordion widget.</li>
<p></p>
<li>Categorizing methods as: <em>accessing</em>, <em>initialization</em>, <em>submorphs<span class="pl-k">&#8211;</span>add<span class="pl-k">/</span>remove</em> etc.</li>
<p></p>
<li>Removal of unwanted/redundant/commented code lines i.e. scrubbing dead-code.</li>
<p>
</ul>
<p><strong>UPCOMING: Wrap Up.</strong></p>
<hr />
