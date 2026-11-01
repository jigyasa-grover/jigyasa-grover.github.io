---
layout: post
type: blog
title: "Tiny Hack: Propping macOS Sierra (version 10.12.1) to work with QHM8106 USB LAN Card"
date: "2016-12-24T12:48:58+00:00"
description: "Hey ! So while packing to come back home for the Holiday Season , I forgot my Apple Thunderbolt to Gigabit Ethernet Adapter worth ~US$40 at my…"
original_url: "https://jigyasagrover.wordpress.com/2016/12/24/tiny-hack-propping-macos-sierra-version-10-12-1-to-work-with-qhm8106-usb-lan-card/"
og_image: "/assets/images/wp-archive/2016/931384_3a37_21-bbe0e7e9.jpg"
archival: true
noindex: true
sitemap: false
archive_tags: ["Developer Tooling"]
---

<p><img src="/assets/images/wp-archive/2016/931384_3a37_21-bbe0e7e9.jpg" alt="931384_3a37_2" loading="lazy" /></p>
<p>Hey !</p>
<p>So while packing to come back home for the <em>Holiday Season</em>, I forgot my <a href="https://www.amazon.com/Apple-Thunderbolt-Gigabit-Ethernet-Adapter/dp/B00BD39WMK">Apple Thunderbolt to Gigabit Ethernet Adapter</a> worth <em>~US$40</em> at my university lodging unintentionally. Not in a spirit to spend money on same kind of adapter, I bought a comparatively cheaper <a href="http://www.qhmpl.com/QHM8106-usb-lan-card.html">Quantum QHM8106 USB LAN Card</a> worth<em>~US$4.50 </em>to make my MacBook Pro work with the high speed ethernet at least for the time being.</p>
<p>Because of pretty much obvious reasons, it wasn&#8217;t guaranteed to be compatible <em>macOS Sierra</em> owing to Apple&#8217;s latest update with security. It was also disappointing that the product didn&#8217;t come with any CD or link to have the necessary drivers. On reaching home, I first tried it with <a href="http://store.hp.com/us/en/mdp/Laptops/envy-17-344517--1?jumpid=lt_featured_na_5_161025#!&amp;Tab=features">Hewlett Packard Envy 17</a>, my home laptop loaded with<em> Windows 10</em>. Initially, it didn&#8217;t recognise but after a few restarts and disable/enable, the tiny red and green LEDs did light up along with a &#8216;internet access&#8217; notification, making sure that the cheap adapter was in well working condition.</p>
<p>Next, connecting it to my <em>MacBook Pro</em> it showed no signs of even lighting that tiny red LED indicator on the adapter. The routine restarts and disable/enable didn&#8217;t help either, I wasn&#8217;t amazed 😅</p>
<p>Doing the basic search, I found a thread on <a href="https://discussions.apple.com/">discussions.apple.com</a> titled <a href="https://discussions.apple.com/thread/7258667?start=0&amp;tstart=0">&#8220;Quantum Usb to lan adapter not working in El Capitan, it worked fine with Yosemite.&#8221;</a> which gave little information except for a link to a blog. Reading through it and also taking the risk of disabling <em>Mac&#8217;s SIP (System Integrity Protection)</em> to install not-much-verified driver didn&#8217;t help instead made the system boot up very slow. I had to undo the entire process to bring things back to normal.</p>
<p>After changing a few settings locally leading to nowhere, I was back to googling. Now, I tried finding a driver to install to make it work. Reading about different drivers compatible with macOS but not Sierra in particular, I wasn&#8217;t really sure about helpful installation and working.</p>
<p>Like an oasis in a vast dry desert, I came across the hint of <a href="http://www.asix.com.tw/products.php?op=pItemdetail&amp;PItemID=86;71;101&amp;PLine=71">AX88772 &#8212; USB2.0 to 10/100M Fast Ethernet Controller with Embedded PHY</a> being utilised in <em>QHM8106</em>. Going through the quality reading material provided by the <em>Axis Electronics Corporation</em>, I was well satisfied and downloaded the <a href="http://www.asix.com.tw/FrootAttach/driver/AX88772C_772B_772A_760_772_Macintosh_10.5_to_10.12_Driver_Installer_v2.5.0.zip">Apple Mac OS X 10.5 to 10.12 Driver (V2.5.0)</a>. Finally, the installation of the <em>AX88772 Driver for Mac</em> from the <em>Axis Electronics Corporation</em> and a restart was all <em>macOS Sierra</em> and <em>QHM8106 USB LAN Card</em> needed to kick-off working in sync serving their holy purpose.</p>
<p class="p1">Phew, that was quite an hour or two spent !</p>
<p class="p1">Thanks Google, random blogspots, discussion threads and Axis Electronics Corporation.</p>
<p>Hope this helps all who are in the same situation 🙂</p>
<p>Happy Hacking !</p>
