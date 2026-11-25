{% raw %}
Previously I shared two research readings ([Part 1](https://jigyasa-grover.github.io/research-reading-approaches-to-click-through-rate-estimation-1-x/) and [Part 2](https://jigyasa-grover.github.io/research-reading-approaches-to-click-through-rate-estimation-2-x/)) for CTR estimation and keeping up with the spirit of this series, I am sharing an overview of a very interesting research paper [Deep Interest Evolution Network for Click-Through Rate Prediction](https://www.aaai.org/ojs/index.php/AAAI/article/view/4545) authored by the *Alibaba Group* and published in AAAI Conference on Artificial Intelligence 2019.

![Illustration 1 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-26-26-pm-c1bc640f.png)

![Illustration 2 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-27-06-pm-b8f67f32.png)

![Illustration 3 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-27-26-pm-a1c9ba59.png)

![Illustration 4 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-28-00-pm-de0621ce.png)

![Illustration 5 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-28-19-pm-8f895547.png)

![Illustration 6 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-28-47-pm-2db530b0.png)

![Illustration 7 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-29-07-pm-b3fee472.png)

![Illustration 8 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-29-34-pm-7a14b943.jpg)

![Illustration 9 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-30-39-pm-f2cfd541.png)

![Illustration 10 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-31-08-pm-982a3921.png)

![Illustration 11 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-31-33-pm-bf8c725e.png)

![Illustration 12 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-31-54-pm-8fd3d574.png)

![Illustration 13 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-32-19-pm-8244e76c.png)

![Illustration 14 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-32-46-pm-21f06496.png)

![Illustration 15 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-33-07-pm-c0c1ca14.png)

![Illustration 16 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-33-28-pm-1499da39.png)

![Illustration 17 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-33-50-pm-a4618b71.png)

![Illustration 18 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-34-17-pm-d9321930.png)

![Illustration 19 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-34-38-pm-b7b4aa98.png)

![Illustration 20 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-32-19-pm-8244e76c.png)

![Illustration 21 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-35-26-pm-43219b7d.png)

![Illustration 22 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-35-47-pm-7cb9a6ce.png)

![Illustration 23 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-36-04-pm-68c6a855.png)

![Illustration 24 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-36-21-pm-9d1dae7d.png)

![Illustration 25 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-36-40-pm-e66f400d.png)

![Illustration 26 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-37-09-pm-69683069.png)

![Illustration 27 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-37-30-pm-c2a9cd2b.png)

![Illustration 28 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-37-54-pm-e1577189332110-ab43ec09.png)

![Illustration 29 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-38-44-pm-cacde6b6.png)

![Illustration 30 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-5-39-11-pm-a0d3f710.png)

![Illustration 31 — Research Reading: Approaches to click-through rate estimation 3x](https://jigyasa-grover.github.io/assets/images/wp-archive/2019/screen-shot-2019-12-24-at-4-59-42-pm-5d5e2c92.png)
{% endraw %}
