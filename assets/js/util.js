"use strict"

var scope = {};
window.onload = function() {
  console.log("window loaded");
}

function getLocalImage(e){
  return new Promise(function(resolve, reject){
    var reader  = new FileReader();
    var file = e.target.files[0];
    // load to image to get it's width/height
    var img = new Image();
    img.onload = function() {
        resolve(img);
    }
    // this is to setup loading the image
    reader.onloadend = function () {
        img.src = reader.result; 
    }
    // this is to read the file
    reader.readAsDataURL(file);
    });
}

function base64ToArrayBuffer(base64) {
  var binary_string =  window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
   for (var i = 0; i < len; i++)        {
      bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
}

function extractBase64FromString(str){
  const regex = new RegExp('(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)','g');
  var result = regex.exec(str);
  return result[0];
}

// TODO: remove
// function drawImgTo(canvasId, image, width, height, imageData){
//     //TODO: edgecase imageData without width and height not working
//     //TODO: Refactor resizeFactor
//     return new Promise(function(resolve, reject){
//       if(!image && !imageData){
//         reject('no image or imageData provided');
//       } 
//       // console.log('draw1 to ' + canvasId);
//       // console.log(image);
//       var canvas = document.getElementById(canvasId);
//       if(width){
//         canvas.width = width;
//       }else{
//         var resizeFactor = (200 / image.width);
//         canvas.width = image.width * resizeFactor;
//       }
//       if(height){
//         canvas.height = height;
//       }else{
//         var resizeFactor = (200 / image.width);
//         canvas.height = image.height * resizeFactor;
//       }
//       var ctx = canvas.getContext('2d');
//       if(width){
//         ctx.width = width;
//       }else{
//         var resizeFactor = (200 / image.width);
//         ctx.width = image.width * resizeFactor;
//       }
//       if(height){
//         ctx.height = height;
//       }else{
//         var resizeFactor = (200 / image.width);
//         ctx.height = image.height * resizeFactor;
//       }
//       if(image){
//         ctx.drawImage(image, 0, 0, ctx.width, ctx.height);
//       } 
//       if(imageData){
//         ctx.putImageData(imageData, 0, 0);
//       }
//       resolve();
//     });
// }

function darken(image){
  return new Promise(function(resolve, reject){
    var resizeFactor = (200 / image.width);
    var canvas = document.createElement("canvas");
    canvas.height = image.height;
    canvas.width = image.width;
    var ctx = canvas.getContext("2d");
    ctx.height = image.height;
    ctx.width = image.width;
    ctx.drawImage(image,0,0);
    var imgd = ctx.getImageData(0, 0, ctx.width, ctx.height);
    var pix = imgd.data;

    for (var i = 0, n = pix.length; i <n; i += 4) {
      pix[i + 0] -= 150;
      pix[i + 1] -= 150;
      pix[i + 2] -= 150;
      imgd[i] -= 150;
    }          
    ctx.putImageData(imgd, 0, 0);
    var img = new Image(ctx.width, ctx.height);
    img.onload = function() {
        resolve(img);
    }
    img.src = canvas.toDataURL('image/jpeg');
  });
}

function resize(image, newWidth, newHeigth){
  return new Promise(function(resolve, reject){
    var canvas = document.createElement("canvas");
    canvas.height = image.height;
    canvas.width = image.width;
    var ctx = canvas.getContext("2d");
    ctx.width = newWidth;
    ctx.height = newHeigth;
    ctx.drawImage(image,0,0);
    // var imgd = ctx.getImageData(0, 0, ctx.width, ctx.height);
    // console.log(imgd.width, imgd.height);
    var img = new Image(ctx.width, ctx.height);
    img.onload = function() {
        // console.log(img.width, img.height);
        resolve(img);
    }
    img.src = canvas.toDataURL('image/jpeg');
  });
}

function loadDefaultImage(e){
  // get image
  getLocalImage(e)
  .then(function(image){
    return detectFace(image);
  })
  .then(function(image){
    console.log(image.width, image.height);
    // drawImgTo('canvas', image);
    console.log(image.width, image.height);
    // return darken(image);
    return resize(image, 48, 48);
    // return image;
  })
  .then(function(image){
    classify(image).then(function(label){
    });
    return image;
  })
  .then(function(image){
    // console.log(img[0].src);
    // drawImgTo('canvas', images[0]);
    // console.log(image);
    console.log(image.width, image.height);
    drawImgTo('canvas-new', image);
  })
  .catch(function(err){
    console.log('ERROR: ', err);
  });
  // resize
  // predict
  // obj[prop] = Object.assign(obj[prop], {Image: 'Test'});
}

function loadFile(event){
  // load image file
  getLocalImage(event)
  .then(detectFace)
  .then((faceImage)=>{
    drawImgTo('canvas-to-detect', faceImage);
    return resize(faceImage, 48, 48);
  })
  .then(face48 => {
    drawImgTo('canvas-temp', face48, 48, 48);
    testMe();    
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
