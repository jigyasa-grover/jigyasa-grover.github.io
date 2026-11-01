---
layout: post
type: blog
title: "searchQuick Apprise: ONE #GoogleSummerOfCode #FOSSASIA"
date: "2015-06-06T09:47:09+00:00"
description: "The intended “searchQuick” (sQuick) is an application to enable a user to search a set of books or texts, like an encyclopedia, or some other topical…"
original_url: "https://jigyasagrover.wordpress.com/2015/06/06/squick-apprise-one-googlesummerofcode-fossasia/"
og_image: "/assets/images/wp-archive/2015/banner-gsoc2015-pagespeed-ce-1-xg35qq3r8sqj5dggl9-b1e73987.png"
archival: true
noindex: true
sitemap: false
archive_tags: ["FOSSASIA", "Google Summer of Code", "Pharo Smalltalk", "searchQuick"]
---

<p><img src="/assets/images/wp-archive/2015/banner-gsoc2015-pagespeed-ce-1-xg35qq3r8sqj5dggl9-b1e73987.png" alt="banner-gsoc2015.png.pagespeed.ce.1-XG35qq3R8SQJ5DGgL9" loading="lazy" /></p>
<p>The intended <strong>“searchQuick” (sQuick)</strong> is an application to enable a user to search a set of books or texts, like an encyclopedia, or some other topical book collection offline built in the open source platform Pharo 4.0.</p>
<p><img src="/assets/images/wp-archive/2015/header-046c16eb.png" alt="header" loading="lazy" /></p>
<hr />
<hr />
<p>In the inceptive coding period of this project development the tasks achieved are as:</p>
<ul>
<ul>
<li>Designing the basic graphical user interface using Morphs in Pharo 4.0. The morphs elements utilized to make the interface elements included:<br />
<em>&#8211; TextMorph for labels etc.<br />
&#8211; PluggableTextMorph to display the contents of the file<br />
&#8211; ImageMorph for background, header GIFs etc.<br />
&#8211; TextMorphForEditView to enter the search string.<br />
&#8211; SimpleButtonMorphs for creating buttons whose click will perform the desired action.<br />
&#8211; MenuMorph , MenuItemMorph to make the list of files available as &#8216;Browse&#8217; menu.<br />
&#8211; DropListMorph to make a drop down list menu for the selection of languages.</em></li>
</ul>
</ul>
<ul>
<ul>
<li>Loading the files in the current Pharo image and making methods/classes that would directly access those files from the image and display their names as a menu list</li>
</ul>
</ul>
<ul>
<ul>
<li>Making a Metacello Configuration of the project for easy project loading in Pharo.</li>
</ul>
</ul>
<ul>
<ul>
<li>For further ease, the project configuration was directly added to the Meta Repo of Pharo 4.0 at SmalltalkHub.com and now the project can be directly loaded through Configuration Browser in Pharo 4.0</li>
</ul>
</ul>
<blockquote><p>                  <em><strong>World &gt; Tools &gt; Configuration Browser &gt; sQuick(jigyasa)</strong></em></p></blockquote>
<ul>
<ul>
<li>Removing the cache of the instance of the <em>MainInterface</em> so as to allow the users to open up many search/content windows simultaneously</li>
</ul>
</ul>
<ul>
<ul>
<li>Making of a content window that would display the file name and the file content when the file name is clicked from the &#8216;B<em>rowse Files</em>&#8216; menu</li>
</ul>
</ul>
<ul>
<ul>
<li>Designing mock-ups for the UI for an enhanced user interface which include the latest search engine feel</li>
</ul>
</ul>
<p><img src="/assets/images/wp-archive/2015/mockup-5378460b.png" alt="mockup" loading="lazy" /></p>
<p><strong>UPCOMING:</strong></p>
<ul>
<li>Augmenting the UI for a pleasant user experience</li>
<li>Initiate working on the search tool / indexer build.</li>
</ul>
<p><em>Stay tuned for more&#8230;</em><br />
<em>Post any queries , will be happy to help 🙂</em></p>
<hr />
