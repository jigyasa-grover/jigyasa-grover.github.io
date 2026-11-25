{% raw %}
***How do you keep up with the countless innovations and state-of-the-art R&D happening?** * This is one of the most commonly asked questions. 🎙💭🤔

And I have a pretty standard response to it - you have to go above and beyond your day-job to keep up with the developments. Things that have worked for me so far:
✅ attending research and developer conferences
✅ subscribing to newsletters
✅ reading papers and blogs
✅ joining reading groups
✅ discussing with friends or peers

This summer I read a few papers, and here are my **Top 3** from the ones published in 2022.

[**Privacy for Free: How does Dataset Condensation Help Privacy? **](https://arxiv.org/pdf/2206.00240.pdf)My first recommendation concentrates on Privacy Preserving Machine Learning, specifically mitigating the leakage of sensitive data in Machine Learning. The paper provides one of the first propositions of using dataset condensation techniques to preserve the data efficiency during model training and furnish membership privacy. The paper is able to analytically connect the dots between dataset condensation and differential privacy, which is the de-facto standard of data privacy, with both linear and non-linear feature extractors. This paper was published by Sony AI and won the Outstanding Paper Award at ICML 2022.

[**Affective Signals in a Social Media Recommender System **](https://arxiv.org/pdf/2206.12374.pdf)The second paper on my list talks about operationalizing Affective Computing, also known as Emotional AI, for an improved personalized feed on social media. The paper discusses the design of an affective taxonomy customized to user needs on social media. It further lays out the curation of suitable training data by combining engagement data and data from a human-labeling task to enable the identification of the affective response (i.e angered, joyous, informed, entertained, etc.) a user might exhibit for a particular post. One of the major challenges tackled by this paper is translating this open-ended vision of Affective Computing into a precise technical problem along with combining it with other ranking signals for a well-designed recommender system.

[**ItemSage: Learning Product Embeddings for Shopping Recommendations at Pinterest **](https://arxiv.org/pdf/2205.11728.pdf)My last recommendation is a paper by Pinterest that illustrates the aggregation of both textual and visual information to build a unified set of product embeddings to enhance recommendation results on e-commerce websites. By applying multi-task learning, the proposed embeddings can optimize for multiple engagement types (eg. click, save, add to cart, etc.) and ensures that the shopping recommendation stack is efficient with respect to all objectives. The paper further indicates how this approach leads to reduced maintenance and infrastructure costs as there is no need to infer separate embeddings per vertical application (eg. home, search, product closeup, etc.).
{% endraw %}
