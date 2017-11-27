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

function drawImgTo(canvasId, image,image2, imageData){
    return new Promise(function(resolve, reject){
      // if(!image){
      //   reject('no image provided');
      // } 
      if(image){
        console.log('draw1 to ' + canvasId);
        console.log(image);
        var ctx = document.getElementById(canvasId).getContext('2d');
        var resizeFactor = (200 / image.width);
        ctx.width = image.width * resizeFactor;
        ctx.height = image.height * resizeFactor;
        ctx.drawImage(image, 0, 0, ctx.width, ctx.height);
        resolve();
      }

      if(image2){
        console.log('draw2 to ' + canvasId);
        // var ctx = document.getElementById(canvasId).getContext('2d');
        // var resizeFactor = (200 / image.width);
        // ctx.width = image.width * resizeFactor;
        // ctx.height = image.height * resizeFactor;
        // ctx.drawImage(image, 0, 0, ctx.width, ctx.height);
        // var data = ctx.getImageData(0, 0, ctx.width, ctx.height);
        // for(var i = 0; i<ctx.width*ctx.height*4;i++)
        //   data[i] -= 60;
        // ctx.putImageData(data, 0, 0);
        // resolve();
        // var canas = document.createElement(canvasId);
        var canvas = document.getElementById(canvasId);
        var ctx = canvas.getContext("2d");
        var resizeFactor = (200 / image2.width);
        ctx.width = image2.width * resizeFactor;
        ctx.height = image2.height * resizeFactor;
        // ctx.width = image2.width;
        // ctx.height = image2.height;
        ctx.drawImage(image2,0,0, ctx.width, ctx.height);
        var imgd = ctx.getImageData(0, 0, ctx.width, ctx.height);
        var pix = imgd.data;

        for (var i = 0, n = pix.length; i <n; i += 4) {
          pix[i + 0] -= 150;
          pix[i + 1] -= 150;
          pix[i + 2] -= 150;
          // imgd[i] -= 50;
        }          
        ctx.putImageData(imgd, 0, 0);
        // var savedImageData = document.getElementById("newImg");
        // savedImageData.src = canvas.toDataURL("image/png");
        resolve();
        // var base64 = extractBase64FromString(image2.src);
        // var arr = base64ToArrayBuffer(base64);
        // console.log(arr);
        // console.log(arr[0]);
        // for(var i = 0; i<1000; i++)
        //   arr[i] -= 150;
        // console.log(arr);
        // console.log(arr.slice(0,100));
        // for(var i = 500; i<1000; i++){
        //    arr[i] -= 50;
        // }
        // console.log(arr.slice(0,10));
        // var src = 'data:image/jpeg;base64,' + btoa(String.fromCharCode.apply(null, arr));
        // console.log(src);
        // var imgNew = new Image();
        // imgNew.onload = function() {
        //   console.log('onload');
        //   drawImgTo(canvasId, imgNew);
        //   // resolve(imgNew);
        // }
        // imgNew.src = src;
        // console.log('end', imgNew.src);
        // resolve([img, inputData]);
      }

      if(imageData){
        var ctx = document.getElementById(canvasId).getContext('2d');
        var resizeFactor = (200 / imageData.width);
        ctx.width = imageData.width * resizeFactor;
        ctx.height = imageData.height * resizeFactor;
        ctx.putImageData(imageData.data, 0, 0);
        // ctx.putImageData(context.getImageData(0, 0, context.width, context.height), 0, 0);
        // ctx.drawImage(image, 0, 0, ctx.widimageth, ctx.height);
        resolve();

      }
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

function darken(image){
  return new Promise(function(resolve, reject){
    var resizeFactor = (200 / image.width);
    var canvas = document.createElement("canvas");
    // var canvas = document.getElementById("canvas-new");
    canvas.height = image.height;
    canvas.width = image.width;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(image,0,0);
    console.log(ctx);
    // var imgd = ctx.getImageData(0, 0, ctx.width, ctx.height);
    // var pix = imgd.data;

    // for (var i = 0, n = pix.length; i <n; i += 4) {
    //   pix[i + 0] -= 150;
    //   pix[i + 1] -= 150;
    //   pix[i + 2] -= 150;
    //   // imgd[i] -= 50;
    // }          
    // ctx.putImageData(imgd, 0, 0);
    // var savedImageData = document.getElementById("newImg");
    var img = new Image(ctx.width, ctx.height);
    // var img = new Image(200,200);
    img.onload = function() {
        // console.log('onload w h ', img.width, img.height, pix.length);
        resolve(img);
    }
    img.src = canvas.toDataURL('image/jpeg');

    var myImg = document.getElementById('myImg');
    myImg.src = image.src;
  });
}

function resize(image){
  return new Promise(function(resolve, reject){
    if(image){
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext('2d');
      ctx.width = image.width;
      ctx.height = image.height;
      ctx.drawImage(image, 0, 0, ctx.width, ctx.height);
      console.log(image.width, image.height);
      console.log(ctx.width, ctx.height);
      var imageData = ctx.getImageData(0, 0, ctx.width, ctx.height);
      // for(var i = 0; i < ctx.height * ctx.width * 3; i++)
      //   imageData[i] -= 50;
      ctx.putImageData(imageData, 0, 0);
      resolve({data: imageData, height: ctx.height, width: ctx.width});
      // var img = new Image();
      // img.onload = function() {
      //     resolve(img);
      // }
      // img.src = canvas.toDataURL('image/jpeg');
    } 
  });
}

function loadDefaultImage(e){
  // get image
  getLocalImage(e)
  .then(function(image){
    // console.log(image);
    console.log(image.width, image.height);
    drawImgTo('canvas', image);
    console.log(image.width, image.height);
    return darken(image);
    // return resize(image);
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
