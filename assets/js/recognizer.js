window.onload = function() {
  const modelPath = '/assets/keras-models/model4Untouched.json';
  const weightsPath = '/assets/keras-models/model4Untouched_weights.buf';
  const metaDataPath = '/assets/keras-models/model4Untouched_metadata.json';
  scope.kerasManager = new KerasManager(modelPath, weightsPath, metaDataPath);
  var emotions = ['Angry', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral'];
  scope.kerasManager.outputMap = emotions;

  var video = document.getElementById('video');

  // Get access to the camera!
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Not adding `{ audio: true }` since we only want video now
      navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
          video.src = window.URL.createObjectURL(stream);
          video.play();
      });
  }
  scope.video = video;

  console.log('update', 0);
}

function getImageFromCam(video){
  return new Promise((resolve, reject) =>{
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    ctx.width = 640;
    ctx.width = 480;
    ctx.drawImage(video, 0, 0, 640, 480);

    console.log("-----------");
    console.log(video);
    var tempCanvas = document.getElementById('canvas');
    // tempCanvas.width = 640;
    // tempCanvas.heigth = 480;
    var ctx2 = canvas.getContext("2d");
    ctx.width = 640;
    ctx.width = 480;
    ctx2.drawImage(video, 0, 0, video.width, video.height);
    var img = new Image(ctx.width, ctx.height);
    img.onload = function() {
        resolve(img);
    }
    img.src = canvas.toDataURL('image/jpeg');
  });
}

function classify(image){
  // TODO: try new model
  const model = new KerasJS.Model({
    filepaths: {
      model: '../../../../../assets/keras-models/model4.json',
      weights: '../../../../../assets/keras-models/model4_weights.buf',
      metadata: '../../../../../assets/keras-models/model4_metadata.json'
    },
    gpu: true
  });
  var canvas = document.createElement("canvas");
  canvas.height = image.height;
  canvas.width = image.width;
  var ctx = canvas.getContext("2d");
  ctx.height = image.height;
  ctx.width = image.width;
  ctx.drawImage(image,0,0);
  var imgd = ctx.getImageData(0, 0, ctx.width, ctx.height);
  var pix = imgd.data;
  var floatArr = [];
  for(var i = 0; i<pix.length; i+=4){
  var greyValue = (pix[i] + pix[i+1] + pix[i+2])/(3 * 255);
    floatArr.push(greyValue);
  }
  console.log(imgd, floatArr.length, floatArr);
  console.log(model);
  return model.ready()
  .then(() => {
    // input data object keyed by names of the input layers
    // or `input` for Sequential models
    // values are the flattened Float32Array data
    // (input tensor shapes are specified in the model config)
    const inputData = {
      'input': new Float32Array(floatArr)
    }
    // make predictions
    return model.predict(inputData)
  })
  .then(outputData => {
    // outputData is an object keyed by names of the output layers
    // or `output` for Sequential models
    // e.g.,
    // outputData['fc1000']
    console.log(outputData);
  })
  .catch(err => {
    // handle error
    console.log('ERROR:',err);
  });
}

function detectFace(image){
  // drawImgTo('canvas-temp', image, image.width, image.height);
  return new Promise(function(resolve, reject){
    var canvas = document.createElement('canvas');
    canvas.height = image.height;
    canvas.width = image.width;
    var context = canvas.getContext('2d');
    context.height = image.height;
    context.width = image.width;
    context.drawImage(image, 0, 0, context.width, context.height);
    // var classifier = objectdetect.frontalface;
    var classifier = objectdetect.frontalface_alt;
    var detector = new objectdetect.detector(canvas.width, canvas.height, 1.2, classifier);
    var rects = detector.detect(canvas, 1, 1);
    // find the greates rect
    var greatest = 0;
    var maxRect = 0;
    for (var i = 0; i < rects.length; ++i) {
      var coord = rects[i];
      var area = coord[2] * coord[3];
      if ( area > maxRect){
        maxRect = area;
        greatest = i;
      }
    }
    // console.log(rects[greatest][2],rects[greatest][3])
    if (rects[greatest] === undefined) return reject('no face found');
    canvas.width = context.width = rects[greatest][2];
    canvas.height = context.height = rects[greatest][3];
    context.drawImage(image, rects[greatest][0], rects[greatest][1], rects[greatest][2], rects[greatest][3],
                             0, 0, rects[greatest][2], rects[greatest][3])
    var img = new Image(context.width, context.height);
    img.onload = function() {
        console.log('detectFace: ', img.width, img.height);
        resolve(img);
    }
    img.src = canvas.toDataURL('image/jpeg');
 
  });
}

function runFaceRecognition(event){
  // load image file
  
  getImageFromCam(scope.video)
  .then(detectFace)
  .then((faceImage)=>{
    // drawImgTo('canvas-to-detect', faceImage);
    return resize(faceImage, 48, 48);
  })
  .then(face48 => {
    // drawImgTo('canvas-temp', face48, 48, 48);
    // testMe();    
    getGrayscaleData(face48)
    .then(floatArr => {
      console.log('floatArr', floatArr);
      var intArr = [];
      for(var i = 0; i<48*48; i++){
        var Y = (floatArr[i]*255).toFixed(0);
        // Y = i%48;
        intArr.push(Y);
        intArr.push(Y);
        intArr.push(Y);
        intArr.push(255);
      }
      // Display floatArr as image
      var uInt8C = new Uint8ClampedArray(intArr);
      var imageData = new ImageData(uInt8C, 48, 48);
      // var myImage = new Image(100, 200);
      // myImage.src = 'picture.jpg';
      drawImgTo('canvas-temp', undefined, 48, 48, imageData);
      return scope.kerasManager.predictP(floatArr);
    })
    .then(prediction => {
      console.log('Prediction', prediction);
      //TODO: check if there is an outputmap, else don't show bar
      var yArr = []; 
      // prediction.output.forEach(item => {
      //   return yArr.push(yArr);
      // });
      for(var i = 0; i<prediction.output.length; i++)
        yArr.push(prediction.output[i]);
      
      var data = [
        {
          x: scope.kerasManager.outputMap,
          y: yArr,
          type: 'bar'
        }
      ];
  
      Plotly.newPlot('graph', data);
    });

  });
}