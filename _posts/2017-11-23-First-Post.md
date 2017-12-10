---
layout: post
title:  "Recognizing Emotions via Convolution Networks"
date:   2017-11-23 20:49:01 +0000
categories: jekyll update
---

Humans can easily recognize the mood of a person by looking at them.  
Explaining why we know that someone is sad or angry is hard and not trivial at all.  
To teach machines emotion detection, we simply need to feed a neural network with lots of facial expressions.  
Lets to solve this problem using CNN!

---


## Demo

<script> window.myScope = {}; </script>

<style>
</style>


<button style="position: relative; bottom: 15px; left: 50%; margin-left: -60px; width: 120px; font-size: 20px;" onclick="runFaceRecognition(window, 'myScope')">Recognize</button>

<video id="video" width="640" height="480" autoplay></video>
<canvas width="400" height="300" id="canvas"/>

<canvas width="400" height="300" id="canvas-to-detect"/>

<canvas width="400" height="300" id="canvas-temp"/>

<canvas width="400" height="300" id="canvas-hidden" hidden/>

<p id='myText'></p>
<div id='graph'></div>
<img id='myImg' />


## The Dataset  

The [Kaggle Dataset](https://www.kaggle.com/c/challenges-in-representation-learning-facial-expression-recognition-challenge/data "Challenges in Representation Learning: Facial Expression Recognition Challenge") prepared by Pierre-Luc Carrier and Aaron Courville,
consists of 48x48 grayscale images. It's divided in 28,709 training, 3,589 testing and 3,589 validation examples.  
Each image is labeled as one of seven classes [Angry, Disgust, Fear, Happy, Sad, Surprise].  

![](/assets/images/faces-overview.png)
Taking a deeper look at how the emotions are distributed, we notice that *Disgust* is underrepresented.
<center><img src='/assets/images/image-bar.png'/></center>
Therefore it is removed, leaving 6 emotions to recognize.


## Cleanup
The daily life of a data scientist is to clean the data. Digging a bit into the images we find that there are some problematic data.  
#### Overlayed Text  
<center><img src='/assets/images/images-overlayed-text.png' style='width: 50%'/></center>

#### Abstract Images  
<center><img src='/assets/images/images-abstract.png' style='width: 50%'/></center>

#### Mislabel  
<center><img src='/assets/images/images-mislabeled.png' style='width: 12%'/></center>

#### Outlier  
<center><img src='/assets/images/images-outlier.png' style='width: 50%'/></center>


To decide which images to keep, we take a simple approach. By calculating the [entropy](https://www.hdm-stuttgart.de/~maucher/Python/MMCodecs/html/basicFunctions.html) and sum them to a single number, which we sort. After some experimentation I figured 1% is a good dismiss rate.
```python
# remove 1% of the images with the lowest entropy
  def removePercentage(X_data, y_data, X_data_entropy, percentage):
      n = int(len(X_data)*percentage/100)
      indexList, _ = zip(*X_data_entropy[:n])
      indexList = sorted(indexList, reverse=True)
      return np.delete(X_data, indexList, 0), np.delete(y_data, indexList)
```

## The Model  
<img src='/assets/images/CNN-Emotion-Recognition-Overview.svg' style='width: 100%'/>

The model is build using the [keras](https://keras.io/) libary.  
```python
def createModel():
    model = Sequential()
    model.add(Conv2D(filters=16, kernel_size=7, padding='same',
                     activation='relu', input_shape=(48, 48, 1)))
    model.add(AveragePooling2D(pool_size=2, padding='same'))
    model.add(Conv2D(filters=32, kernel_size=2, padding='same',
                     activation='relu'))
    model.add(MaxPooling2D(pool_size=2))
    model.add(Conv2D(filters=8, kernel_size=2, padding='same',
                     activation='relu'))
    model.add(MaxPooling2D(pool_size=2))
    model.add(Dropout(0.3))
    model.add(Flatten())
    model.add(Dense(100, activation='relu'))
    model.add(Dense(6, activation='softmax'))

    model.summary()
    model.compile(optimizer='rmsprop', 
                  loss='categorical_crossentropy', metrics=['accuracy'])
    return model
```

## Result

The overall accuracy is close to 50% for the testing set.
<img src='/assets/images/Results.png' style='width: 100%'/>
<img src='/assets/images/confusionMatrix.png' style='width: 100%'/>


