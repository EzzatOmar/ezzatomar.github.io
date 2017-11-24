function fn(){
  alert("fn()");
  document.getElementById("demo").innerHTML = "Hello World!";
}

window.onload = function() {
  var input = document.getElementById('input');
  input.addEventListener('change', loadDefaultImage, false);
}

function getLocalImage(e){
  var ctx = document.getElementById('canvas').getContext('2d');
  var reader  = new FileReader();
  var file = e.target.files[0];
  // load to image to get it's width/height
  var img = new Image();
  img.onload = function() {
      // scale canvas to image
      ctx.canvas.width = img.width;
      ctx.canvas.height = img.height;
      // draw image
      ctx.drawImage(img, 0, 0
          , ctx.canvas.width, ctx.canvas.height
      );
  }
  // this is to setup loading the image
  reader.onloadend = function () {
      img.src = reader.result;
  }
  // this is to read the file
   reader.readAsDataURL(file);
}

function loadDefaultImage(e){
  // get image
  getLocalImage(e);
  // resize
  // predict
  // obj[prop] = Object.assign(obj[prop], {Image: 'Test'});
}

function print(){
  console.log(myScope);
}
