"use strict"

function drawImageToP(canvasId, image, width, height){
  return new Promise((resolve, reject) => {
    var canvas = document.getElementById(canvasId);
    if(canvas===undefined) reject(canvasId + " not found");

    canvas.width = width;
    canvas.height = height;

    var context = canvas.getContext('2d');
    context.width = width;
    context.height = height;
    context.drawImage(image, 0, 0, width, height);
    resolve('Image drawn');
  });
}

function resizeImageP(image, newWidth, newHeight){
  return new Promise(function(resolve, reject){
    var canvas = document.createElement("canvas");
    canvas.height = image.height;
    canvas.width = image.width;
    var ctx = canvas.getContext("2d");
    ctx.width = newWidth;
    ctx.height = newHeigth;
    ctx.drawImage(image,0,0);
    var img = new Image(ctx.width, ctx.height);
    img.onload = function() {
      canvas = null;
      resolve(img);
    }
    img.src = canvas.toDataURL('image/jpeg');
  });
}

function getGrayscaleData(image) {
  /*
    returns Uint8ClampedArray object 
    takes an image obj
  */
  //TODO: check if image is already in grayscale
  return new Promise((resolve, reject) =>{
    var arr = [];
    var canvas = document.createElement("canvas");
    canvas.height = image.height;
    canvas.width = image.width;
    var ctx = canvas.getContext("2d");
    ctx.width = image.width;
    ctx.height = image.height;
    ctx.drawImage(image,0,0, image.width, image.height);
    
    var imageData = ctx.getImageData(0, 0, image.width, image.height);
    console.log('imageData', imageData);
    var data = imageData.data;
    var Y = 0;
    for(var i = 0; i<data.length; i+=4){
      if(i%(28*4)==4){
      }
      Y = .2126 * data[i] + .7152 * data[i+1] + .0722 * data[i+2]
      Y = Math.round(Y) / 255.0;
      arr.push(Y);
    }
    canvas = null;
    resolve(new Float32Array(arr));
  });
}