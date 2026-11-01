---
layout: post
type: blog
title: "searchQuick Apprise: FIVE #GoogleSummerOfCode #FOSSASIA"
date: "2015-08-01T04:35:09+00:00"
description: "The intended “ searchQuick” (sQuick) is an application to enable a user to search a set of books or texts, like an encyclopedia, or some other topical…"
original_url: "https://jigyasagrover.wordpress.com/2015/08/01/searchquick-apprise-five-googlesummerofcode-fossasia/"
og_image: "/assets/images/wp-archive/2015/banner-gsoc2015-pagespeed-ce-1-xg35qq3r8sqj5dggl9-b1e73987.png"
archival: true
noindex: true
sitemap: false
archive_tags: ["FOSSASIA", "Google Summer of Code", "Pharo Smalltalk", "searchQuick"]
---

<p><img src="/assets/images/wp-archive/2015/banner-gsoc2015-pagespeed-ce-1-xg35qq3r8sqj5dggl9-b1e73987.png" alt="banner-gsoc2015.png.pagespeed.ce.1-XG35qq3R8SQJ5DGgL9" loading="lazy" /></p>
<p>The intended <strong>“</strong><strong>searchQuick” (sQuick)</strong> is an application to enable a user to search a set of books or texts, like an encyclopedia, or some other topical book collection offline built in the open source platform Pharo 4.0.</p>
<p><img src="/assets/images/wp-archive/2015/header-046c16eb.png" alt="header" loading="lazy" /></p>
<hr />
<div align="left">As the rudimentary structure of the application is sewn up, embellishment of GUI and rigorous testing are the major part of course of action.</div>
<div align="left"></div>
<div align="left">On eMBee&#8217;s ( <a href="https://www.blogger.com/null" target="_blank">+Martin Bähr</a> ) suggestion to build up an <a href="https://jqueryui.com/accordion/" target="_blank">accordion widget</a> to display the search results, various trials were conducted to design a similar one in Pharo.</div>
<div align="left"></div>
<div align="left"></div>
<div align="left"><img src="/assets/images/wp-archive/2015/33a2e-simple-stylish-accordion-widget-with-jquery-css-5f1a820f.jpg" alt="Illustration 3 — searchQuick Apprise: FIVE GoogleSummerOfCode FOSSASIA" loading="lazy" /></div>
<div align="left">
<p>The task of developing the accordion widget in Pharo was achieved using <i>Expander Morphs. </i>Looping through the search results array, a <i>#newExpander:</i> was added in each <i>#newRow:</i> of the modal built.</p>
<div align="left"></div>
<div align="left">A challenging chore was to add a scroll-able content on the click of the desired search result expander. Sundry experiments with <i>#newLabel:</i> and <i>#newText:</i> in <i>#newScrollPaneFor:</i> {i.e. adding text model and labels in scroll pane} had no effect. Eventually, <i>#newTextEditorFor:</i> did the trick and the desired look was created.</div>
<div align="left"></div>
</div>
<div align="left"><img src="/assets/images/wp-archive/2015/ebaac-screenshot2bfrom2b2015-07-202b11253a04253a24-b9a0874b.png" alt="Illustration 4 — searchQuick Apprise: FIVE GoogleSummerOfCode FOSSASIA" loading="lazy" /></div>
<div align="left"></div>
<div align="left"></div>
<div align="left"><img src="/assets/images/wp-archive/2015/4cbcf-screenshot2bfrom2b2015-07-202b11253a04253a41-0391da6c.png" alt="Illustration 5 — searchQuick Apprise: FIVE GoogleSummerOfCode FOSSASIA" loading="lazy" /></div>
<div align="left">
<div align="left"></div>
<div align="left"></div>
<div align="left">Next on the cards is putting up <b>sQuick</b> for automated build on the CI Server, as suggested by <a href="https://plus.google.com/114851489196992826758" target="_blank">+Sean DeNigris</a> for its various advantages which include:</div>
<ul>
<li>
<div align="left">Improvement of product quality</div>
</li>
<li>
<div align="left">Acceleration of compile and link processing</div>
</li>
<li>
<div align="left">Elimination of redundant tasks</div>
</li>
<li>
<div align="left">Minimization of &#8216;bad builds&#8217;</div>
</li>
<li>
<div align="left">Have history of builds and releases in order to investigate issues</div>
</li>
<li>
<div align="left">Save time and money &#8211; because of above listed reasons.</div>
</li>
</ul>
<div align="left"></div>
<div align="left">For simplicity, <b>Build automation</b> is the act of scripting or automating a wide variety of tasks that software developers do in their day-to-day activities including things like:</div>
<ul>
<li>
<div align="left">compiling computer source code into binary code</div>
</li>
<li>
<div align="left">packaging binary code</div>
</li>
<li>
<div align="left">running automated tests</div>
</li>
<li>
<div align="left">deploying to production systems</div>
</li>
<li>
<div align="left">creating documentation and/or release notes</div>
</li>
</ul>
<div align="left"></div>
<div align="left"><b><u>UPCOMING:</u></b></div>
<div align="left">To achieve Build Automation for sQuick, I have already registered on CI and configured sQuick.<br />
Next endeavor is to look into the red signal in the build evaluation.</div>
<div align="left"></div>
<div><i> </i></div>
<div><i><br />
</i><i>Stay tuned for more&#8230;.</i><i>Post any queries, will be happy to help 🙂</i></div>
</div>
<div></div>
