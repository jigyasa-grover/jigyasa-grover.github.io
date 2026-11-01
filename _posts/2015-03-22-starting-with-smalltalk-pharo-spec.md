---
layout: post
type: blog
title: "Starting with Smalltalk , Pharo and Spec"
date: "2015-03-22T18:42:35+00:00"
description: "Hi ! It’s been a few weeks since I started with Smalltalk, Pharo and Spec. Under the guidance of Mr. Martin Bähr , Mr. Sean DeNigris and people from…"
original_url: "https://jigyasagrover.wordpress.com/2015/03/22/starting-with-smalltalk-pharo-spec/"
og_image: "/assets/images/wp-archive/2015/worldforumlogo-64623ae6.png"
archival: true
noindex: true
sitemap: false
archive_tags: ["Pharo Smalltalk"]
---

<p><strong>Hi !</strong></p>
<p>It’s been a few weeks since I started with Smalltalk, Pharo and Spec. Under the guidance of <em>Mr. Martin Bähr</em>, <a href="http://seandenigris.com/blog/?page_id=2" target="_blank"><em>Mr. Sean DeNigris</em></a> and people from the <em>#pharo</em> community (<em>@thierry</em>, <em>@kilon</em>, <em>@maxleske</em>) I have been able to learn Pharo in a systematic way. I have implemented the knowledge gained by building a few simple desktop applications using the resources available online.</p>
<p>This post intends to clear all your doubt regarding the basic definitions of Smalltalk, Pharo and Spec.<em><br />
</em><br />
<strong>GETTING THE BASICS CLEARED:<br />
</strong></p>
<p><strong><em>Smalltalk</em> </strong>is an object-oriented, dynamically typed, reflective programming language. It was designed and created in part for educational use, more so for constructionist learning. The language was first generally released as Smalltalk-80.</p>
<p>A Smalltalk environment is its own little world, designed around a conception of a computer with a minimal operating system and populated with living objects. A Smalltalk implementation is composed of an image (binary code), a major source file and a &#8216;changes&#8217; file. The image is called Virtual Image (VI) because is independent form the platform you use for running Smalltalk. Smalltalk systems store the entire program state (including both Class and non-Class objects) in an image file. The image can then be loaded by the Smalltalk virtual machine to restore a Smalltalk-like system to a prior state.</p>
<p><img src="/assets/images/wp-archive/2015/worldforumlogo-64623ae6.png" alt="worldforumlogo" loading="lazy" /></p>
<blockquote><p>As Sean DeNigris wrote to me: <em>“</em><em>You may not realize it, but you have opened a portal to some of the greatest minds in the history of our industry. You have in your hands, not a programming language, but a live, dynamic, turtles-all-the-way-down environment designed to provide &#8216;support for the creative spirit in everyone&#8217;. More practically, Smalltalk is a programming tool that allows productivity unimaginable in most systems. And, if you put in enough time and effort to actually think in it, it will help you program better in any language you use.” ; </em>Smalltalk is more dynamic and powerful than what one can think of.<em><br />
</em></p></blockquote>
<p><a title="Pharo" href="http://pharo.org/" target="_blank"><em><strong>Pharo</strong> </em></a>is an open source implementation of the programming language and environment Smalltalk. Pharo is not Smalltalk. Pharo is Smalltalk-inspired.</p>
<p>Pharo offers strong live programming features such as immediate object manipulation, live update, and hot recompilation. Live programming environment is in the heart of the system. Pharo also supports advanced web development with frameworks such as Seaside and more recently Tide.</p>
<p>The official Pharo website defines it as: <em>Pharo is a pure object-oriented programming language and a powerful environment, focused on simplicity and immediate feedback (think IDE and OS rolled into one).</em></p>
<p>Pharo relies on a virtual machine that is written almost entirely in Smalltalk itself.</p>
<p><img src="/assets/images/wp-archive/2015/pharo-e0e1a47a.jpg" alt="pharo" loading="lazy" /></p>
<p><a href="http://spec.st/" target="_blank"><strong><em>Spec</em> </strong></a>is a simple framework for describing User Interface (UI) for Pharo Smalltalk. It takes a model and a layout description, runs it through an interpreter and a UI is produced as a result. All the widget implemented this can then immediately be reused as any other widget.</p>
<p>It also allows the separation of concerns between the different parts of the user interface as expressed in the MVP pattern. Spec emphasis the reuse of the widgets as well as their customization.</p>
<p><em>I hope now you have got the classifications of Smalltalk , Pharo , Spec all cleared up which remains a basic doubt in every beginners mind.</em></p>
<p><strong>INSTALLATION GUIDE:</strong></p>
<p>Visit the official <a href="http://pharo.org/" target="_blank">Pharo</a> website’s <a href="http://pharo.org/download" target="_blank">download </a>tab to get the desired version of Pharo for the corresponding OS.</p>
<p>For a step by step tutorial describing various ways to install Pharo in your system visit the &#8216;<a href="https://playingwithobjects.wordpress.com/2013/07/23/installing-pharo-in-many-flavors/" target="_blank">Installing Pharo in many flavors&#8217; blog</a> written in a very systematic manner by Guille Polito.<cite><b class="fn"></b></cite></p>
<p>Follow the steps as given in <a href="http://spec.st/docs/quickstart/" target="_blank">Spec Documentation</a> to install Spec in a Pharo Image.</p>
<p><strong>RESOURCES :<br />
</strong></p>
<ul>
<li><a href="http://web.gioorgi.com/squeak/squeak_tutorial-2.html" target="_blank">Smalltalk tutorial</a></li>
<li><a href="http://pharobyexample.org/" target="_blank">Pharo By Example</a></li>
<li><a href="http://www.pharocasts.com/" target="_blank">Pharo Casts </a></li>
<li><a href="http://www.deepintopharo.com/" target="_blank">Deep Into Pharo</a></li>
</ul>
<p>Visit <a href="http://pharo.org/documentationto">http://pharo.org/documentationto</a> to get more resources to study from.</p>
<p><strong>INTERESTING READS:</strong></p>
<ul>
<li><a title="Programmers: You Probably Don’t Know What a Computer Is" href="http://seandenigris.com/blog/?p=1092" target="_blank">Programmers: You Probably Don&#8217;t Know What A Computer Is </a>by Sean DeNigris</li>
</ul>
<p><em><strong>PS  –  Watch out this blog for tutorials to build basic desktop applications in Pharo.</strong></em></p>
<p><strong>Do like the post if it was helpful.<br />
For any queries/suggestions please comment below.</strong></p>
<p><strong>Thank You</strong></p>
