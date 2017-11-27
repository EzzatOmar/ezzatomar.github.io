function fn(){
  alert("fn()");
  document.getElementById("demo").innerHTML = "Hello World!";
}

window.onload = function() {
  var input = document.getElementById('input');
  input.addEventListener('change', loadDefaultImage, false);
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

function drawImgTo(canvasId, image){
    return new Promise(function(resolve, reject){
      if(!image){
        reject('no image provided');
      } 
      console.log('draw1 to ' + canvasId);
      console.log(image);
      var ctx = document.getElementById(canvasId).getContext('2d');
      var resizeFactor = (200 / image.width);
      ctx.width = image.width * resizeFactor;
      ctx.height = image.height * resizeFactor;
      ctx.drawImage(image, 0, 0, ctx.width, ctx.height);
      resolve();
    });
}

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
    console.log(image.width, image.height);
    drawImgTo('canvas', image);
    console.log(image.width, image.height);
    // return darken(image);
    return resize(image, 48, 48);
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

function print(){
  console.log(myScope);
}
