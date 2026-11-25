{% raw %}
*“When and how did you get started with Open Source?”     *

This is the question I get asked the most often, And it never catches me off guard. I have a very nice anecdote (saving it up for a post for some other day) to share as an answer to this which starts with [Pharo](http://pharo.org/). My history with Pharo dates back to late 2014 when I was a noob (I still am, in many aspects 😂)

Since then, I have always worked remotely for *Pharo*, ranging from developing **sQuick** (the offline text search utility) under *FOSSASIA *, desktop apps like **SiteMap Generator** including file hierarchy, **MorphoPhysics** using concepts of elasticity, in-built **Contact Manager** widget, **Rolling Dice** game, Lights Out puzzle for electric geeks, **Text Editor **as hobby project, etc. to authoring chapters and full-blown tutorials in the books **Fun with Pharo** and **Pharo in Progress** with **Square Brackets Associates** and bug-fixes in **Pharo 4.0**.

Starting this year, I got an assignment to work on the applied modelling of relationship between societies and their environment initiated by **Centre de coopération internationale en recherche agronomique pour le développement** in the beautiful country of France. As expected, it was indeed a wonderful learning experience as I fabricated CORMAS’ Pharo extension from scratch at the esteemed **Institut de Recherche pour le Développement** under the supervision of Dr. Serge Stinckwich, Nick Papoulias and Pierre Bommel.

![Illustration 8 — Paris, France to Maribor, Slovenia .. and beyond  Chronicles of CORMAS Pharo](https://jigyasa-grover.github.io/assets/images/wp-archive/2017/photogrid_1486052550585-0e97d0b5.jpg)

**After lunch break, on a sunny day in the beautiful campus of ‘*Institut de Recherche pour le Développement’* featuring frozen pond in the background in Paris**

A good time was spent elbowing on the lines of object-oriented programming which has had a long-standing history with simulation systems in terms of human-computer interaction dating back to *Simula* and early versions of *Smalltalk-72* and *Smalltalk-76* (which form the heart of Pharo environment). It was observed that these frameworks were based on discrete, event-based simulations as revealed by the classic simulation examples of [Smalltalk-80 Blue-book](http://stephane.ducasse.free.fr/FreeBooks/BlueBook/Bluebook.pdf) (for me & many, it’s like the Bible of Smalltalk).

Nevertheless present time trends have pivoted towards agent-based modelling and abstractions, with systems like *NetLogo* capturing a sizeable following and heed. Two of the widely known agent-based modelling (ABM) platforms in Smalltalk (*MobiDyC* & *CORMAS*) have recently begun experimenting with porting their systems to Pharo. The rationale behind this choice is to allow modern re-imagination of the platforms that can take advantage of developments in: agile visualization, moldable tools, domain-specific languages (DSLs) and so on.

Hence, we focused our work on the salient user interface component of these platforms, namely the *spatial interface*, which empowers a user to visualize the evolution of the system through time. We started with a concise analysis of the state-of-the-art for spatial interfaces and their platforms (MobiDyC, NetLogo, GAMA and CORMAS), scrutinising in terms of programming flexibility, extensibility, portability, scalability, and interaction. Subsequently we progressed in building an open-source extension for CORMAS’ spatial interface in Pharo.

The handful of weeks I spent working on this project were full of  exploring the mesmerising *City of Lights & Love* in the peak of its winter. From visiting Eiffel Tower at different temperatures/times of the day, posing in front of The Louvre for that perfect click, catching up with my Canadian friend in a 150 year old Bouillon Chartier to attending local conferences & concerts and solo wandering in the much acclaimed Champs-Élysées. It was like living out of the books and travelogues, where Paris existed for me  before this trip. To be honest, it turned out to be much more than that (both ways 😉). Bidding adieu to the lovely city and the friends I had made in such a short span of time was definitely not smooth.

Once I was back home, I was in constant touch with all my supervisors as we began work on documenting the project in a well defined manner in a hope to come up with a publication to be presented in the community’s upcoming annual conference. A special shoot-out to Nick for being on those weird time hangout calls (timezones !) just minutes before the final submission deadline topped with the weak(-est) internet connection. The team was super happy when the results were out and our publication had made it, though with some final reviews pending.

After a few weeks of evaluation, re-working and finalising travel plans, I flew to Maribor (Slovenia) to present our work at the **ESUG 25th International Smalltalk Joint Conference** (🎉) which was published in ACM Library under *Proceedings of the 12th Edition of the International Workshop on Smalltalk Technologies*. Check it out [here](https://dl.acm.org/citation.cfm?id=3139915) !

 

![Illustration 1 — Paris, France to Maribor, Slovenia .. and beyond  Chronicles of CORMAS Pharo](https://jigyasa-grover.github.io/assets/images/wp-archive/2017/screen-shot-2017-10-22-at-2-33-54-am-5214eb5c.png)

![Illustration 2 — Paris, France to Maribor, Slovenia .. and beyond  Chronicles of CORMAS Pharo](https://jigyasa-grover.github.io/assets/images/wp-archive/2017/screen-shot-2017-10-22-at-2-34-30-am-034ad8e7.png)

![Illustration 3 — Paris, France to Maribor, Slovenia .. and beyond  Chronicles of CORMAS Pharo](https://jigyasa-grover.github.io/assets/images/wp-archive/2017/screen-shot-2017-10-22-at-2-34-47-am-867b1fe8.png)

![Illustration 4 — Paris, France to Maribor, Slovenia .. and beyond  Chronicles of CORMAS Pharo](https://jigyasa-grover.github.io/assets/images/wp-archive/2017/screen-shot-2017-10-22-at-2-35-15-am-d0de83c8.png)

Not only was I speaker for two sessions (one was done as a responsible **Google Summer of Code Org Admin** – on the spot) but I also made myself available as a student volunteer in my venture to give back to the cozy little community of Pharo-ers !

 

![Illustration 5 — Paris, France to Maribor, Slovenia .. and beyond  Chronicles of CORMAS Pharo](https://jigyasa-grover.github.io/assets/images/wp-archive/2017/screen-shot-2017-10-22-at-3-05-11-am-a5c595e0.png)

![Illustration 6 — Paris, France to Maribor, Slovenia .. and beyond  Chronicles of CORMAS Pharo](https://jigyasa-grover.github.io/assets/images/wp-archive/2017/screen-shot-2017-10-22-at-3-04-15-am-20a977ea.png)

![Illustration 7 — Paris, France to Maribor, Slovenia .. and beyond  Chronicles of CORMAS Pharo](https://jigyasa-grover.github.io/assets/images/wp-archive/2017/screen-shot-2017-10-22-at-3-02-39-am-ae3250d8.jpg)

Of course, due acknowledgements – This work and all the associated travels were funded by the *FuturAgua Project (Belmont Forum)* with a complementary scholarship from *European Smalltalk Users Group*. A kind thanks to Pierre Bommel (CIRAD), Serge Stinckwich (IRD), Nick Papoylias (IRD) and Stéphane Ducasse (INRIA) for their continuous support and guidance.
{% endraw %}
