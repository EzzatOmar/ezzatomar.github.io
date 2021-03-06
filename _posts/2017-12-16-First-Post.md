---
layout: post
title:  "Recognizing Emotions via Convolution Networks"
date:   2017-12-16 11:49:01 +0000
categories: jekyll update
comments: true
---

Humans can easily recognize the mood of a person by looking at them.  
Explaining why we know that someone is sad or angry is hard and not trivial at all.  
To teach machines emotion detection, we simply need to feed a neural network with lots of facial expressions.  
Lets solve this problem using CNN!


## Demo

<script> window.myScope = {}; </script>

<script src="/assets/js/recognizer.js"></script>

<style>
  .floatL {
    float: left;
  }
  .floatR {
    float: right;
  }
  .floatN {
    float: none;
  }
</style>


<button style="position: relative; bottom: 15px; left: 50%; margin-left: -60px; width: 120px; font-size: 20px;" id="recognizeBtn"><center>Recognize</center></button>

<div class='floatN'>
  <div class='floatL'><video id="video" width="320" height="240" autoplay></video></div>
  <div class='floatR'><canvas width="320" height="240" id="canvas-snapshot"/></div>
</div>
<div style="clear:both;"></div>
<!-- <div class='floatN'><canvas width="400" height="300" id="canvas-to-detect"/></div> -->

<div class='floatN' id='graph'></div>

## The Dataset  

The [Kaggle Dataset](https://www.kaggle.com/c/challenges-in-representation-learning-facial-expression-recognition-challenge/data "Challenges in Representation Learning: Facial Expression Recognition Challenge") is prepared by Pierre-Luc Carrier and Aaron Courville,
consists of 48x48 grayscale images. It's divided in 28,709 training, 3,589 testing and 3,589 validation examples.  
Each image is labeled in one of seven classes [Angry, Disgust, Fear, Happy, Sad, Surprise].  

![](/assets/images/faces-overview.png)  

Taking a deeper look at how the emotions are distributed, we notice that *Disgust* is underrepresented.
<center><img src='/assets/images/image-bar.png'/></center>
Therefore it is removed, leaving 6 emotions to recognize.


## Cleanup
The daily life of a data scientist is to clean the data. Analysing the images, we find that there are some problematic data.  
#### Overlayed Text  
<center><img src='/assets/images/images-overlayed-text.png' style='width: 50%'/></center>

#### Abstract Images  
<center><img src='/assets/images/images-abstract.png' style='width: 50%'/></center>

#### Mislabel  
<center><img src='/assets/images/images-mislabeled.png' style='width: 12%'/></center>

#### Outlier  
<center><img src='/assets/images/images-outlier.png' style='width: 50%'/></center>
<br>
  
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
## Predict 
To run the model on the browser, we use the awesome javascript wrapper [keras.js](https://github.com/transcranial/keras-js).  
After saving and [converting](https://transcranial.github.io/keras-js-docs/conversion/) the model for keras.js, we load it and access the webcam.  

```javascript
window.onload = function() {
  var model = new KerasJS.Model({
      filepaths: {
      model: modelPath,
      weights: weightsPath,
      metadata: metaDataPath
      },
      gpu: true
  });

  var video = document.getElementById('video');

  // Get access to the camera!
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
      video.src = window.URL.createObjectURL(stream);
      video.play();
    });
  }

  scope.video = video;

  document.getElementById('recognizeBtn').addEventListener('click', runRecognizer, true);
}
```

Adding a listener to our button, will execute the runRecognizer function which takes a snapshot, detect the face, resize it to 48x48 and feed the model.

```javascript
function runRecognizer(){
  getImageFromCamP(video)
  .then(detectFace);
  .then((faceImage) => {return resizeImageP(faceImage, 48, 48);})
  .then(getGrayscaleData)
  .then(floatArray => {
    const inputDataStruct = {
      'input': floatArray
    }
    return model.ready()
    .then(()=>{
      return model.predict(inputDataStruct)
    });
  })
  .then(drawOutput)
  .catch(err => {console.log("ERROR:", err);});
}
```
## Result

The overall accuracy is close to 60% for the testing set.
<img src='/assets/images/Results.png' style='width: 100%'/>
<img src='/assets/images/confusionMatrix.png' style='width: 100%'/>
