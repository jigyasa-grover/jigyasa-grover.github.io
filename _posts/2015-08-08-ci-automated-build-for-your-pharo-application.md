---
layout: post
type: blog
title: "[Tutorial] Continuous Integration Automated Build for your Pharo Application"
date: "2015-08-08T11:20:55+00:00"
description: "Hello Fellas ! This post aims to put forward the basics of Build Automation and also brief the steps required to put up a Pharo application on…"
original_url: "https://jigyasagrover.wordpress.com/2015/08/08/ci-automated-build-for-your-pharo-application/"
og_image: "/assets/images/wp-archive/2015/screenshot-from-2015-08-08-155349-e846a0e9.png"
archival: true
noindex: true
sitemap: false
archive_tags: ["CI & Build Automation", "Pharo Smalltalk"]
---

<div align="left">
<p>Hello Fellas !</p>
</div>
<div align="left">This post aims to put forward the basics of <strong><em>Build Automation</em></strong> and also brief the steps required to put up a <em>Pharo</em> application on <a href="https://ci.inria.fr/">Continuous Integration, Inria</a> which is a platform for Scheduled Automated Build.</div>
<div align="left"></div>
<div align="left"></div>
<div align="left">
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
</div>
<p>Various types of automation are as:</p>
<ul>
<li><b>On-Demand automation</b> such as a user running a script at the command line</li>
<li><b>Scheduled automation</b> such as a continuous integration server running a nightly build</li>
<li><b>Triggered automation</b> such as a continuous integration server running a build on every commit to a version control system.</li>
</ul>
<div align="left"></div>
<div align="left">In recent years, build management tools have provided relief when it comes to automating the build process.</div>
<div align="left"></div>
<div align="left"><strong>The dominant benefits of continuous integration include:</strong></div>
<div align="left">
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
<div align="left">Minimization of ‘bad builds’</div>
</li>
<li>
<div align="left">Have history of builds and releases in order to investigate issues</div>
</li>
<li>
<div align="left">Save time and money – because of above listed reasons.</div>
</li>
</ul>
<p>A build system should fulfill certain requirements.</p>
<p><strong>Basic requirements:</strong></p>
<ol>
<li>Frequent or overnight builds to catch problems early.</li>
<li>Support for Source Code Dependency Management</li>
<li>Incremental build processing</li>
<li>Reporting that traces source to binary matching</li>
<li>Build acceleration</li>
<li>Extraction and reporting on build compile and link usage</li>
</ol>
</div>
<div align="left">
<p><strong>Optional requirements:</strong></p>
<ol>
<li>Generate release notes and other documentation such as help pages</li>
<li>Build status reporting</li>
<li>Test pass or fail reporting</li>
<li>Summary of the features added/modified/deleted with each new build</li>
</ol>
</div>
<div align="left">
<hr />
</div>
<div align="left"></div>
<div align="left">Considering the above mentioned advantages of automated build, the below enlisted steps will help to put up your own Pharo application hosted on github on the CI server for continuous integration/scheduled build.</div>
<div align="left"></div>
<div align="left">1. Log on to <strong>Continuous Integration, Inria </strong>website (<a href="https://ci.inria.fr/" rel="nofollow">https://ci.inria.fr/</a>).</div>
<div align="left"></div>
<p><a href="/assets/images/wp-archive/2015/screenshot-from-2015-08-08-155349-e846a0e9.png"><img src="/assets/images/wp-archive/2015/screenshot-from-2015-08-08-155349-e846a0e9.png" alt="Illustration 1 — Tutorial Continuous Integration Automated Build for your Pharo Application" loading="lazy" /><br />
</a>2. Click on &#8216;<strong>Sign Up</strong>&#8216; at the top-right corner, enter the required details and register for CI.</p>
<p><a href="/assets/images/wp-archive/2015/screenshot-from-2015-08-08-155402-46445b82.png"><img src="/assets/images/wp-archive/2015/screenshot-from-2015-08-08-155402-46445b82.png" alt="Illustration 2 — Tutorial Continuous Integration Automated Build for your Pharo Application" loading="lazy" /><br />
</a>3. From the &#8216;<strong>Dashboard</strong>&#8216; option located at the top most of the screen click on &#8216;<strong>Join an existing project</strong>&#8216; blue button as shown .</p>
<p><a href="/assets/images/wp-archive/2015/screenshot-from-2015-08-08-155922-c566ed44.png"><img src="/assets/images/wp-archive/2015/screenshot-from-2015-08-08-155922-c566ed44.png" alt="Illustration 3 — Tutorial Continuous Integration Automated Build for your Pharo Application" loading="lazy" /><br />
</a>4. Search &#8216;<strong>pharo-contribution</strong>&#8216; in the enlisted public projects and click on &#8216;<strong>Join</strong>&#8216;</p>
<ol>
<li>On clicking the &#8216;<strong>Join</strong>&#8216; button, a message stating: &#8220;<strong>Request to join the project &#8216;pharo-contribution&#8217; sent</strong>.&#8221; appears.</li>
<li>It might take a day or two for the request approval mail to deliver at your registered Email ID.</li>
</ol>
<p>The E-Mail content is as follows:<br />
<strong><em>        Your request to join pharo-contribution has been accepted</em></strong><br />
<strong><em><strong><em>        </em></strong>Hi _ _ _, </em></strong><br />
<strong><em><strong><em>        </em></strong>Your request to join the project pharo-contribution has been accepted !</em></strong><br />
<strong><em><strong><em>        </em></strong>Regards,</em></strong><br />
<strong><em>        </em></strong><strong><strong><em>Support team.</em></strong></strong></p>
<ol>
<li>Click on &#8216;<strong>My Account</strong>&#8216; option and under &#8216;<strong>My Projects</strong>&#8216; check the status of pharo-contribution project. It should state &#8216;<em>member</em>&#8216;.</li>
</ol>
<p><a href="/assets/images/wp-archive/2015/screenshot-from-2015-08-08-161755-f219703b.png"><img src="/assets/images/wp-archive/2015/screenshot-from-2015-08-08-161755-f219703b.png" alt="Illustration 4 — Tutorial Continuous Integration Automated Build for your Pharo Application" loading="lazy" /><br />
</a>8. Now, visit the LINK: <a href="https://ci.inria.fr/pharo-contribution/job/JobTemplate/">https://ci.inria.fr/pharo-contribution/job/JobTemplate/ </a> to create a &#8216;<strong>New Job</strong>&#8216;</p>
<p><a href="/assets/images/wp-archive/2015/screenshot-from-2015-08-08-162106-9273d2db.png"><img src="/assets/images/wp-archive/2015/screenshot-from-2015-08-08-162106-9273d2db.png" alt="Illustration 5 — Tutorial Continuous Integration Automated Build for your Pharo Application" loading="lazy" /><br />
</a>9. Read all the steps mentioned carefully. After going through all the points, click on the &#8216;<strong>New Job</strong>&#8216; mentioned in point 2 on the <em>Project Job Template</em> web page.</p>
<ol>
<li>Enter the &#8216;<strong>Project Name</strong>&#8216; in the &#8216;<strong>Item Name:</strong> &#8216; box and choose &#8216;<strong>Copy from existing item</strong>&#8216; option and fill &#8216;<strong>JobTemplate</strong>&#8216;</li>
</ol>
<p><a href="/assets/images/wp-archive/2015/screenshot-from-2015-08-08-163001-f7817d79.png"><img src="/assets/images/wp-archive/2015/screenshot-from-2015-08-08-163001-f7817d79.png" alt="Illustration 6 — Tutorial Continuous Integration Automated Build for your Pharo Application" loading="lazy" /><br />
</a>11. After clicking <strong>OK</strong>, You will be directed to your project configuration.</p>
<ol>
<li>Fill in the description of the project in the desired box.</li>
</ol>
<p><a href="/assets/images/wp-archive/2015/screenshot-from-2015-08-08-163231-8370d435.png"><img src="/assets/images/wp-archive/2015/screenshot-from-2015-08-08-163231-8370d435.png" alt="Illustration 7 — Tutorial Continuous Integration Automated Build for your Pharo Application" loading="lazy" /><br />
</a>13. Fill int the configuration details of your project like:</p>
<p><em>* Maximum number of builds</em><br />
<em>*  Link to GitHub Project</em><br />
<em>*  Source Code Manager</em><br />
<em>* Build Triggers</em><br />
<em>*  Schedule of build (@hourly, @daily, @weekly, @fortnightly, @monthly, @yearly etc.)</em><br />
<em>*  Configuration Matrix (User Defined Axis: Name &amp;&amp; Version Values- stable, development etc.)</em><br />
<em>* Build environment options</em><br />
<em>* Post-build actions</em><br />
<em><em>*  Report regressed tests</em></em></p>
<ol>
<li>The main task is to carefully write the commands in the &#8216;<strong>Execute Shell</strong>&#8216;<br />
The default commands are as:</li>
</ol>
<p><a href="/assets/images/wp-archive/2015/screenshot-from-2015-08-08-163906-13196ca9.png"><img src="/assets/images/wp-archive/2015/screenshot-from-2015-08-08-163906-13196ca9.png" alt="Illustration 8 — Tutorial Continuous Integration Automated Build for your Pharo Application" loading="lazy" /><br />
</a>15. After saving and applying the changes, the application is all set for automated build.</p>
<ol>
<li>Each build&#8217;s &#8216;<strong>Console Output</strong>&#8216; can be used to analyse the steps and highlight the weak areas of the project.<br />
For instance: The below output is of a project whose stable version build was successful.</li>
</ol>
<p><img src="/assets/images/wp-archive/2015/screenshot-from-2015-08-08-164905-09518b86.png" alt="Illustration 9 — Tutorial Continuous Integration Automated Build for your Pharo Application" loading="lazy" /></p>
<p><strong>TIP</strong>: Keep a regular tab on the build results and analyze each line of the Console Output with utmost care.</p>
<p>Hope this post was able to help you start with the automation build process of Pharo Application.</p>
<p><em>Do like if it was worth a read !</em><br />
<em>Post queries/suggestions as comments 🙂 Looking forward to them.</em></p>
<hr />
<p><strong>UPCOMING</strong>: Next, I plan to share experience of putting up my Pharo application <a href="https://ci.inria.fr/pharo-contribution/job/sQuick_new/">searchQuick</a> on CI Inria for automated build. I intend to detail about the various configuration settings applied along with the <em>Execute Shell</em> commands utilized for a GitHub project 🙂</p>
<hr />
<p><strong>Introduction Accredits: <a href="https://en.wikipedia.org/wiki/Main_Page">Wikipedia </a></strong><br />
<strong> Resources:  <a href="https://en.wikipedia.org/wiki/Build_automation">Build Automation</a> and <a href="https://en.wikipedia.org/wiki/Continuous_integration">Continuous Integration </a>.</strong></p>
<hr />
<div align="left"></div>
<div align="left"></div>
<div align="left"></div>
