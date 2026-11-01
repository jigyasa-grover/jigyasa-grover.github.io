---
layout: post
type: blog
title: "TicTacToe Tutorial #FunWithPharo"
date: "2015-04-06T10:42:00+00:00"
description: "This tutorial has been included as a chapter in Fun With Pharo! Tic-tac-toe (or Noughts and crosses , Xs and Os ) is a paper-and-pencil game for two…"
original_url: "https://jigyasagrover.wordpress.com/2015/04/06/tictactoe-tutorial-funwithpharo/"
og_image: "/assets/images/wp-archive/2015/t-2c0170a9.png"
archival: true
noindex: true
sitemap: false
archive_tags: ["Pharo Smalltalk"]
---

<p><em><strong>This tutorial has been included as a chapter in  <a href="https://github.com/SquareBracketAssociates/FunWithPharo/tree/master/TicTacToe">Fun With Pharo!</a></strong></em></p>
<hr />
<hr />
<p><b>Tic-tac-toe</b> (or <b>Noughts and crosses</b>, <b>Xs and Os</b>) is a paper-and-pencil game for two players, <i>X</i> and <i>O</i>, who take turns marking the spaces in a 3×3 grid. The player who succeeds in placing three respective marks in a horizontal, vertical, or diagonal row wins the game.</p>
<p>Because of the simplicity of Tic-tac-toe, it is often used as a pedagogical tool for teaching the concepts of good sportsmanship and the branch of artificial intelligence that deals with the searching of game trees. It is straightforward to write a computer program to play Tic-tac-toe perfectly, to enumerate the 765 essentially different positions (the state space complexity), or the 26,830 possible games up to rotations and reflections (the game tree complexity) on this space.</p>
<p><img src="/assets/images/wp-archive/2015/t-2c0170a9.png" alt="t" loading="lazy" /></p>
<p>So , here we make a Pharo version of this well-known game by using Morph. This post provides a step-by-step approach on how to go about building this simple application.</p>
<p><img src="/assets/images/wp-archive/2015/ttt2-eadc689f.png" alt="TTT2" loading="lazy" /></p>
<p>A <strong>game</strong> package will be built having 3 subclasses :</p>
<ul>
<li>TicTacToe</li>
<li>TicTacToeCell</li>
<li>TicTacToeModel</li>
</ul>
<p>Initially , we have created <strong>TicTacToe</strong> a subclass of the <em>Object</em> class. The subclasses we will make will be combined in the package <strong>game</strong> as mentioned in the <em>category:</em> parameter.</p>
<figure>
<blockquote>
<pre><code class="smalltalk"><span class="class">Object</span> <span class="method">subclass:</span> <span class="symbol">#TicTacToe</span>
<span class="method">instanceVariableNames:</span> <span class="string">'container model'</span>
<span class="method">classVariableNames:</span> <span class="string">''</span>
<span class="method">poolDictionaries:</span> <span class="string">''</span>
<span class="method">category:</span> <span class="string">'game'</span></code></pre>
</blockquote><figcaption></figcaption></figure>
<p>A category name is not required in order for the class to work, but you will not be able to access the class to make changes or to look at existing code unless you provide a category name. (The category name used can be a new category name or the name of an existing category.)</p>
<p>The <em>poolDictionaries:</em> parameter is seldom used and will not be discussed here, and the category: parameter specifies the category under which this class will be grouped in the system browser.</p>
<p>As we know, a class encapsulates data values and methods, and every object contains a set of the data values and can receive any of the methods as a message. The data values in each object are specified by providing a set of names of variables whose values will be an object&#8217;s internal data values. Each object has its own set of these values, and the set of data values for an object represents the object&#8217;s state (or value). The variables that contain the data values of an object are called the <em>instance variables</em> for the object, and the <em>instanceVariableNames:</em> parameter is a list of names, separated by blanks, for the instance variables. In the above code snippet , we have declared <strong>container</strong> and <strong>model</strong> as two instanceVariables.</p>
<p>The <em>classVariableNames:</em> parameter lists the identifiers that are the names of variables shared by the class and all of its objects. That is, there is only one set of these, and they are used by the class and all of its objects. Class variables (so called because they belong to the class, of which there is only one, rather than to the objects that are instances of the class) are rarely needed.</p>
<p>An example of a class variable that could be useful is in a case where we wanted a unique &#8220;serial number&#8221; to be assigned to each instance of the class as it is created. The variable containing the next available (or last used) serial number would appropriately be a class variable, and each time a new instance (object) is created the serial number would be recorded as an instance variable value in the object and the serial number in the class variable would be incremented. Thus, each object can be serially numbered as it is created (without using one of those nasty global variables!).</p>
<p>After executing the code above, class <strong>TicTacToe</strong> will exist. However, it will have no methods other than those that are inherited from class Object. To make it useful, we must add the methods that are needed for our implementation.</p>
<p><strong>Adding methods to classes : </strong></p>
<p>The subClasses interact by passing messages through objects only.</p>
<figure>
<blockquote>
<pre><code class="smalltalk"><span class="class">TicTacToe</span>&gt;&gt;<span class="symbol">#initialize</span> 
container := <span class="class">Morph</span> new 
              <span class="method">layoutPolicy:</span> <span class="class">TableLayout</span> new; 
              <span class="method">color:</span> <span class="class">Color</span> transparent.
model := <span class="class">TicTacToeModel</span> <span class="method">new:</span><span class="number">3.</span>
<span class="keyword">self</span> addRows.
<span class="keyword">self</span> addControls.
^self.</code></pre>
</blockquote><figcaption></figcaption></figure>
<p>The notation <em><strong>TicTacToe&gt;&gt;#initialize</strong></em> means that we have a method named <em>initialize</em> in the subclass <em>TicTacToe</em>.</p>
<p>In the <strong>initialize:</strong> method above , we have a container which is the instance of the class Morph (<em>Morphic is the name given to Pharo’s graphical interface. </em>). We define the various attributes of the container such as <em>layoutPolicy: </em> and <em>color:</em>. <em>model</em> is another instance of the class <strong>TicTacToeModel</strong> which we will be creating further in this example.</p>
<p><strong>self</strong> refers to the receiver of the message. It is usually used within a method to send additional messages to the receiver. self is frequently used when it is desired to pass the sender object (self), as a message argument, to a receiver who requires knowledege of the sender or who will in some way manipulate the sender.</p>
<p>In short, self refers to the object itself that defines the method.</p>
<figure>
<blockquote>
<pre><code class="smalltalk"><span class="class">TicTacToe</span>&gt;&gt;<span class="symbol">#addRows</span>
<span class="localvars">| rowMorph aCell rowCol |</span>
<span class="number">1</span> <span class="method">to:</span><span class="number">3</span> <span class="method">do:</span>[ :row |
rowMorph := <span class="class">Morph</span> new <span class="method">layoutPolicy:</span> <span class="class">RowLayout</span> new.
<span class="number">1</span> <span class="method">to:</span> <span class="number">3</span> <span class="method">do:</span> [ :col |
aCell := <span class="class">TicTacToeCell</span> new.
aCell <span class="method">setModel:</span> (model) <span class="method">row:</span> row <span class="method">col:</span> col.
rowMorph <span class="method">addMorph:</span> aCell.
].
container <span class="method">addMorph:</span> rowMorph.
]</code></pre>
</blockquote><figcaption></figcaption></figure>
<p>The method <strong>addRows</strong> (the name is self explanatory) is used to add rows in the Tic Tac Toe grid. It declares temporary (local) variables <strong>rowMorph</strong> , <strong>aCell</strong> and <strong>rowCol</strong> which can&#8217;t be used beyond this method.</p>
<p><em>1 to:3 do:[ :row |</em></p>
<p><em>rowMorph := Morph new layoutPolicy: RowLayout new.</em></p>
<p><em>1 to: 3 do: [ :col |</em></p>
<p><em>aCell := TicTacToeCell new.</em></p>
<p><em>aCell setModel: (model) row: row col: col.</em></p>
<p><em>rowMorph addMorph: aCell.</em></p>
<p><em>].</em></p>
<p>The above code snippet works as a nested loop that runs thrice for each three rows to create a 3X3 grid as per requirement.</p>
<figure>
<blockquote>
<pre><code class="smalltalk"><span class="class">TicTacToe</span>&gt;&gt;<span class="symbol">#addControls</span>
<span class="localvars">| rowMorph newGameButton exitGameButton |</span>
rowMorph := <span class="class">Morph</span> new 
             <span class="method">layoutPolicy:</span> <span class="class">RowLayout</span> new; 
             <span class="method">color:</span> <span class="class">Color</span> transparent.
newGameButton := <span class="keyword">self</span> <span class="method">createCtrlLabelled:</span> <span class="string">'New'</span>    <span class="method">onClickExecutes:</span> [<span class="keyword">self</span> restart].
exitGameButton := <span class="keyword">self</span> <span class="method">createCtrlLabelled:</span> <span class="string">'Exit'</span>  <span class="method">onClickExecutes:</span> [container delete].
rowMorph <span class="method">addMorph:</span> exitGameButton.
rowMorph <span class="method">addMorph:</span> newGameButton.
container <span class="method">addMorph:</span> rowMorph.</code></pre>
</blockquote><figcaption></figcaption></figure>
<p>This method adds controls to the game. The local variables are : <strong>rowMorph</strong> , <strong>newGameButton</strong> and <strong>exitGameButton</strong>.</p>
<p><em>rowMorph</em> defines an instance of the class Morph which would be the placeholder for the two control buttons located at the top. The two control buttons are defined as <strong>New</strong> using the variable <em>new GameButton</em> which on click would <em>restart</em> the game , and <strong>Exit</strong> using the <em>exitGameButton</em> which on click would close the game. The buttons are created using a method <strong>createCtrlLabelled</strong> which we define next.</p>
<p><strong>rowMorph addMorph: newGameButton</strong> adds the button to the Morph instance created earlier.</p>
<figure>
<blockquote>
<pre><code class="smalltalk"><span class="class">TicTacToe</span>&gt;&gt;<span class="symbol">#createCtrlLabelled</span>: aString <span class="method">onClickExecutes:</span> aBlock
<span class="localvars">| aCtrlButton |</span>
aCtrlButton := <span class="class">SimpleButtonMorph</span> new <span class="method">label:</span> aString.
aCtrlButton <span class="method">color:</span> (<span class="class">Color</span> black <span class="method">alpha:</span> <span class="number">0.2</span>).
aCtrlButton <span class="method">extent:</span> <span class="number">120</span>@<span class="number">50.</span>
aCtrlButton <span class="method">on:</span> <span class="symbol">#click</span> <span class="method">send:</span> <span class="symbol">#value</span> <span class="method">to:</span> aBlock.
^aCtrlButton.</code></pre>
</blockquote><figcaption></figcaption></figure>
<p><strong>TicTacToe&gt;&gt;#createCtrlLabelled: aString onClickExecutes: aBlock</strong> method makes a simple button using Morph adds label and control to it.</p>
<figure>
<blockquote>
<pre><code class="smalltalk"><span class="class">TicTacToe</span>&gt;&gt;<span class="symbol">#open</span> 
container openInWindow.</code></pre>
</blockquote><figcaption></figcaption></figure>
<p>The <strong>open</strong> method defines as to how the game/TicTacToe class would open. Here we have defined it to open in a dialog box.</p>
<figure>
<blockquote>
<pre><code class="smalltalk"><span class="class">TicTacToe</span>&gt;&gt;<span class="symbol">#restart</span>
container delete.
<span class="class">Smalltalk</span> garbageCollect.
<span class="class">TicTacToe</span> new open.</code></pre>
</blockquote><figcaption></figcaption></figure>
<p>It closes the game and calls for Garbage Collection (Garbage Collection (GC) is a form of automatic memory management. It finds data objects in a program that cannot be accessed in the future and reclaims the resources used by those objects.)</p>
<figure>
<blockquote>
<pre><code class="smalltalk"><span class="class">SimpleButtonMorph</span> <span class="method">subclass:</span> <span class="symbol">#TicTacToeCell</span>
<span class="method">instanceVariableNames:</span> <span class="string">'parentModel rowNum colNum'</span>
<span class="method">classVariableNames:</span> <span class="string">''</span>
<span class="method">poolDictionaries:</span> <span class="string">''</span>
<span class="method">category:</span> <span class="string">'game'</span></code></pre>
</blockquote><figcaption></figcaption></figure>
<p>Here a subclass <strong>TicTacToeCell</strong> is defind in the <em>SimpleButtonMorph</em> class with <strong>parentModel</strong> , <strong>rowNum</strong> and <strong>colNum</strong> as the instance variables. This class defines the button for each cell of the grid.</p>
<figure>
<blockquote>
<pre><code class="smalltalk"><span class="class">TicTacToeCell</span>&gt;&gt;<span class="symbol">#initialize</span> 
<span class="keyword">super</span> initialize.
<span class="keyword">self</span> <span class="method">label:</span> <span class="string">''</span>.
<span class="keyword">self</span> <span class="method">extent:</span> <span class="number">80</span>@<span class="number">80.</span>
<span class="keyword">self</span> <span class="method">color:</span> <span class="class">Color</span> yellow .
<span class="keyword">self</span> <span class="method">on:</span> <span class="symbol">#click</span> <span class="method">send:</span> <span class="symbol">#value</span> <span class="method">to:</span> (<span class="keyword">self</span> onClickExecutionBlock).
^self.</code></pre>
</blockquote><figcaption></figcaption></figure>
<p>This <strong>initialize</strong> method initialises the button size as 80X80 and gives it the <em>color:</em> yellow. An &#8216;onClick&#8217; control is given to the button which then calls the <strong>onClickExecutionBlock</strong> method present in the same class.</p>
<figure>
<blockquote>
<pre><code class="smalltalk"><span class="class">TicTacToeCell</span>&gt;&gt;<span class="symbol">#setModel</span>: ticTacToeModel <span class="method">row:</span> aRow <span class="method">col:</span> aCol
parentModel := ticTacToeModel.
rowNum := aRow.
colNum := aCol.</code></pre>
</blockquote><figcaption></figcaption></figure>
<p>The <strong>setModel: row: col: </strong> takes three arguments <strong>ticTacToeModel</strong> , <strong>aRow</strong> and <strong>aCol</strong>. The <em>parentModel</em> is assigned ticTacToeModel , <em>roNum</em> becomes the value of aRow and similiarly <em>colNum</em> has the value aCol.</p>
<figure>
<blockquote>
<pre><code class="smalltalk"><span class="class">TicTacToeCell</span>&gt;&gt;<span class="symbol">#onClickExecutionBlock</span>
^[
(<span class="keyword">self</span> label size) == <span class="number">0</span>
<span class="method">ifTrue:</span>[
<span class="keyword">self</span> <span class="method">label:</span> (parentModel <span class="method">updateAtRow:</span> rowNum 
                <span class="class">Col</span>: colNum).
parentModel checkWinCondition.
<span class="keyword">self</span> <span class="method">extent:</span> <span class="number">80</span>@<span class="number">80.</span>
].
 ]</code></pre>
</blockquote><figcaption></figcaption></figure>
<p>This method defines what should happen when each cell in the grid is clicked. At every click , the label of the cell is changed to <strong>X</strong> or <strong>O</strong> depending upon whose turn it is , the row numbers and coloumn numbers are updated in the <em>parentModel</em> and <em>win condition</em> is checked by calling the <strong>checkWinCondition</strong> method of the class <strong>TicTacToeModel</strong> defined next.</p>
<figure>
<blockquote>
<pre><code class="smalltalk"><span class="class">Matrix</span> <span class="method">subclass:</span> <span class="symbol">#TicTacToeModel</span>
<span class="method">instanceVariableNames:</span> <span class="string">'filledCellCount currentFill winner'</span>
<span class="method">classVariableNames:</span> <span class="string">''</span>
<span class="method">poolDictionaries:</span> <span class="string">''</span>
<span class="method">category:</span> <span class="string">'game'</span></code></pre>
</blockquote><figcaption></figcaption></figure>
<p>A subclass <strong>TicTacToeModel</strong> is defined in the <em>Matrix</em> class with <strong>filledCellCount</strong> , <strong>currentFill</strong> and <strong>winner</strong> as the instance variables.</p>
<figure>
<blockquote>
<pre><code class="smalltalk"><span class="class">TicTacToeModel</span>&gt;&gt;<span class="symbol">#initialize</span> 
<span class="keyword">super</span> initialize.
filledCellCount := <span class="number">0.</span>
currentFill := nil.
winner := nil.</code></pre>
</blockquote><figcaption></figcaption></figure>
<p>This <strong>initialize</strong> methods defines that initially no cell in the grid is filled and there is no <em>winner</em> as of now.</p>
<figure>
<blockquote>
<pre><code class="smalltalk"><span class="class">TicTacToeModel</span>&gt;&gt;<span class="symbol">#updateAtRow</span>: r <span class="class">Col</span>: c
currentFill == <span class="keyword">nil</span>
<span class="method">ifTrue:</span>[ currentFill := <span class="string">'X'</span>. ]
<span class="method">ifFalse:</span>[
currentFill == <span class="string">'X'</span>
<span class="method">ifTrue:</span> [ currentFill := <span class="string">'O'</span>. ]
<span class="method">ifFalse:</span> [ currentFill := <span class="string">'X'</span>. ]
].
<span class="keyword">self</span> <span class="method">at:</span> r <span class="method">at:</span> c <span class="method">put:</span> currentFill.
filledCellCount := filledCellCount + <span class="number">1.</span>
^currentFill.</code></pre>
</blockquote><figcaption></figcaption></figure>
<p>The <strong>updateRowAt: Col: </strong> method takes two arguments <em>r</em> and <em>c</em> used to update the <em>currentFill</em> and <em>filledCellCount</em> variables.</p>
<figure>
<blockquote>
<pre><code class="smalltalk"><span class="class">TicTacToeModel</span>&gt;&gt;<span class="symbol">#checkWinCondition</span>
filledCellCount &gt;= <span class="number">5</span> <span class="comment">"for optimization. Win can occur minimum at 5th turn"</span>
<span class="method">ifTrue:</span> [
<span class="class">Transcript</span> <span class="method">show:</span> <span class="string">'Yes'</span>.
<span class="number">1</span> <span class="method">to:</span> <span class="number">3</span> <span class="method">do:</span> [:idx |
<span class="keyword">self</span> <span class="method">checkWinConditionInRow:</span> idx.
<span class="keyword">self</span> <span class="method">checkWinConditionInColumn:</span> idx.
].
<span class="keyword">self</span> checkWinConditionInDiagonals.
].
<span class="method">checkWinConditionInRow:</span> rowNum
<span class="localvars">|set|</span>
winner isNil
<span class="method">ifTrue:</span> [
set := (<span class="keyword">self</span> <span class="method">atRow:</span> rowNum) asSet.
<span class="keyword">self</span> <span class="method">checkWinConditionInSet:</span> set
].
^winner.</code></pre>
</blockquote><figcaption></figcaption></figure>
<p>The method <strong>checkWinCondition</strong> is self explanatory. It is used to check if we have a winner or not at every move.</p>
<figure>
<blockquote>
<pre><code class="smalltalk"><span class="class">TicTacToeModel</span>&gt;&gt;<span class="symbol">#checkWinConditionInColumn</span>: colNum
<span class="localvars">|set|</span>
winner isNil
<span class="method">ifTrue:</span> [
set := (<span class="keyword">self</span> <span class="method">atColumn:</span> colNum) asSet.
<span class="keyword">self</span> <span class="method">checkWinConditionInSet:</span> set.
].
^winner.</code></pre>
</blockquote><figcaption></figcaption></figure>
<figure>
<blockquote>
<pre><code class="smalltalk"><span class="class">TicTacToeModel</span>&gt;&gt;<span class="symbol">#checkWinConditionInDiagonals</span>
<span class="localvars">|set1 set2 |</span>
winner isNil
<span class="method">ifTrue:</span> [
set1 := (<span class="keyword">self</span> diagonal) asSet.
set2 := <span class="class">Set</span> <span class="method">newFrom:</span> {(<span class="keyword">self</span> <span class="method">at:</span> <span class="number">1</span> <span class="method">at:</span> <span class="number">3</span>). (<span class="keyword">self</span> <span class="method">at:</span> <span class="number">2</span> <span class="method">at:</span> <span class="number">2</span>). (<span class="keyword">self</span> <span class="method">at:</span> <span class="number">3</span> <span class="method">at:</span> <span class="number">1</span>)} asOrderedCollection.
<span class="keyword">self</span> <span class="method">checkWinConditionInSet:</span> set1.
<span class="keyword">self</span> <span class="method">checkWinConditionInSet:</span> set2.
].
^winner.</code></pre>
</blockquote><figcaption></figcaption></figure>
<figure>
<blockquote>
<pre><code class="smalltalk"><span class="class">TicTacToeModel</span>&gt;&gt;<span class="symbol">#checkWinConditionInSet</span>: aSet
aSet size == <span class="number">1</span>
<span class="method">ifTrue:</span> [
(aSet <span class="method">includes:</span> <span class="string">'X'</span>)
<span class="method">ifTrue:</span> [
        winner := <span class="string">'P1'</span>. 
        <span class="class">Transcript</span> open. 
        <span class="class">Transcript</span> <span class="method">show:</span> <span class="string">'Player 1 is the winner!!'</span>.
    ].

(aSet <span class="method">includes:</span> <span class="string">'O'</span>)

<span class="method">ifTrue:</span> [
        winner := <span class="string">'P2'</span>.  
        <span class="class">Transcript</span> open. 
        <span class="class">Transcript</span> <span class="method">show:</span> <span class="string">'Player 2 is the winner!!'</span>.
    ].
].</code></pre>
</blockquote>
</figure>
<p><img src="/assets/images/wp-archive/2015/example2-de8db3f3.png" alt="example2" loading="lazy" />.</p>
<p>Now , we have made the game. To open the game , simply execute the following in the playground/workspace.</p>
<figure>
<blockquote>
<pre><code><span class="class">TicTacToe</span> new open.</code></pre>
</blockquote><figcaption></figcaption></figure>
<p>The messages : &#8216;Yes&#8217; , &#8216;Player <strong>x</strong> is the winner&#8217; will be displayed in the <em>Transcript</em>.</p>
<p><em>PS &#8211; This was just the basic implementation. I plan to improvise it further with graphics and other functionality/features.</em></p>
<p><strong>Do like the post if it was helpful.<br />
For any queries/suggestions please comment below.</strong></p>
<p><strong>Thank You</strong></p>
