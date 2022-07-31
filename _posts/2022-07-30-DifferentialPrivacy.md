---
layout: post
type: blog
title: Differential Privacy for Privacy-Preserving Machine Learning 🔐
comments: true
mathjax: true
---

<p>Tonight's explorations led me to the ✨gold✨ standard of mitigating the leakage of data in <a href="https://twitter.com/hashtag/ML">#ML</a> -- <a href="https://twitter.com/hashtag/DifferentalPrivacy">#DifferentalPrivacy</a>. The idea is to add very subtle statistical noise (in the dataset) to make it impossible to infer information about an individual data point.</p>

<center>
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">To put it simply:<br><br>Privacy-Preserving ML = Data Privacy + Model Privacy</p>&mdash; Jigyasa Grover ✨ (@jigyasa_grover) <a href="https://twitter.com/jigyasa_grover/status/1546358987016155136?ref_src=twsrc%5Etfw">July 11, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</center>

<p>A simple example is the collection and publishing of user online behavior, their demographics, etc. while ensuring the confidentiality of the actual responses like the US Census. The goal is to learn about the community without learning about individuals in the community ⚽️</p>

<p><strong><em>Differential Privacy is a probabilistic concept.</em></strong> We can use the Laplace mechanism to add controlled noise to the function or use Randomized Responses that allow for concealed information thus introducing noise and protecting privacy 🔐 <a href="https://twitter.com/hashtag/PrivacyPreservingML">#PrivacyPreservingML</a></p>

<p><a href="https://twitter.com/hashtag/DifferentialPrivacy">#DifferentialPrivacy</a> is a soft balance between data accuracy and data privacy. However, with <a href="https://twitter.com/hashtag/MLEthics">#MLEthics</a> getting their due limelight, it is noteworthy that decreased accuracy &amp; utility is a common issue among all statistical disclosure limitation methods and is not unique to DP.</p>

<figure class="wp-block-video"><video controls src="https://video.twimg.com/tweet_video/FYutO6rVsAAFQIM.mp4"></video></figure>

<center>
  <iframe type="text/html" width="336" height="550" frameborder="0" allowfullscreen style="max-width:100%" src="https://read.amazon.com/kp/card?asin=B08RN47C5T&preview=inline&linkCode=kpe&ref_=cm_sw_r_kb_dp_SM5Z75YRJTFFDKF860QN&tag=mobile0a1329f-20" ></iframe>
 </center>
 
<hr>
