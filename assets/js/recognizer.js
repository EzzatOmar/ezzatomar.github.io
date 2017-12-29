function getImageFromCamP(video){
  return new Promise((resolve, reject) =>{
    var canvas = document.createElement('canvas');
    canvas.setAttribute('width', video.videoWidth);
    canvas.setAttribute('height', video.videoHeight);
    var ctx = canvas.getContext('2d');
    ctx.width = 320;
    ctx.height = 240;
    ctx.drawImage(video, 0, 0);

<<<<<<< HEAD
=======
    console.log("-----------");
    console.log(video);
    var tempCanvas = document.getElementById('canvas-to-detect');
    // tempCanvas.width = 640;
    // tempCanvas.heigth = 480;
    var ctx2 = canvas.getContext("2d");
    ctx2.width = 640;
    ctx2.width = 480;
    ctx2.drawImage(video, 0, 0, video.width, video.height);
>>>>>>> parent of 4d845d0... wip
    var img = new Image(ctx.width, ctx.height);
    img.onload = function() {
        resolve(img);
    }
    img.src = canvas.toDataURL('image/png');
  });
}


function detectFace(image){
  return new Promise(function(resolve, reject){
    var canvas = scope.canvasSnapshot;
    canvas.setAttribute('width', image.width);
    canvas.setAttribute('height', image.height);

    var context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);              
    var classifier = objectdetect.frontalface_alt;
    detector = new objectdetect.detector(canvas.width, canvas.height, 1.2, classifier); 
    var rects = detector.detect(canvas);
    if(rects === undefined) reject('No face found');
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
    // Draw rectangles around detected faces:
    var coord = rects[greatest];
    context.beginPath();
    context.lineWidth = '' + coord[4] * .5;
    context.strokeStyle = 'rgba(0, 255, 255, 0.75)';
    context.rect(coord[0], coord[1], coord[2], coord[3]);
    context.stroke();

    var xScale = scope.video.videoWidth / image.width;
    var yScale = scope.video.videoHeight / image.height;
    var faceCanvas = document.createElement('canvas');
    faceCanvas.setAttribute('width', rects[greatest][2]);
    faceCanvas.setAttribute('height',rects[greatest][3]);
    faceContext = faceCanvas.getContext('2d');
    faceContext.drawImage(image, coord[0] * xScale, coord[1] * yScale, coord[2] * xScale, coord[3] * yScale,
                             0, 0, coord[2], coord[3])
    var img = new Image(faceContext.width, faceContext.height);
    img.onload = function() {
        resolve(img);
    }
    img.src = faceCanvas.toDataURL('image/jpeg');
 
  });
}

function runRecognizer(){
  getImageFromCamP(scope.video)
  .then((image) => {
    return detectFace(image);
  })
  .then((faceImage) => {return resizeImageP(faceImage, 48, 48);})
  .then((faceImage) => {
    // drawImageToP(scope.canvasToDetect, faceImage, faceImage.width, faceImage.height);
    return faceImage;
  })
  .then(face48 => {
    getGrayscaleData(face48)
    .then(floatArr => {
      return scope.kerasManager.predictP(floatArr);
    })
    .then(prediction => {
      //TODO: check if there is an outputmap, else don't show bar
      var yArr = []; 
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

window.onload = function() {
  const modelPath = '/assets/keras-models/bestModel.json';
  const weightsPath = '/assets/keras-models/bestModel_weights.buf';
  const metaDataPath = '/assets/keras-models/bestModel_metadata.json';
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
  var canvasSnapshot = document.getElementById('canvas-snapshot');
  var canvasToDetect = document.getElementById('canvas-to-detect');
  var canvasTemp = document.getElementById('canvas-temp');

  scope.video = video;
  scope.canvasSnapshot = canvasSnapshot;
  scope.canvasToDetect = canvasToDetect;
  scope.canvasTemp = canvasTemp;

  document.getElementById('recognizeBtn').addEventListener('click', runRecognizer, true);
}
