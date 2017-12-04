---
layout: post
title:  "Recognizing Emotions via Convolution Networks"
date:   2017-11-23 20:49:01 +0000
categories: jekyll update
---

Teaching machines to detect your emotions is fasinating and scary at the same time. Most of us can easily recognize the mood of someone by looking at their facial expression, but how this is done is a different story.  
To explain why we know that someone is sad or angry is hard and not trivial at all.  
Let's to solve this problem using CNN!
---


## Demo

<script> window.myScope = {}; </script>
<button style="position: relative; bottom: 15px; left: 50%; margin-left: -60px; width: 120px; font-size: 20px;" onclick="loadFile(window, 'myScope')">Recognize</button>

<button style="position: relative; bottom: 15px; left: 50%; margin-left: -60px; width: 120px; font-size: 20px;" onclick="print()">Print</button>
<input type="file" id="input"/>
<div id='pic'>
    <canvas width="400" height="300" id="canvas"/>
</div>

<div id='pic'>
    <canvas width="400" height="300" id="canvas-to-detect"/>
</div>

<div id='pic'>
    <canvas width="400" height="300" id="canvas-temp"/>
</div>

<div id='pic'>
    <canvas width="400" height="300" id="canvas-hidden" hidden/>
</div>

<p id='myText'></p>

<img id='myImg' />
