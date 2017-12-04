"use strict"
var kerasWrapper = {

}
function testMe(){
  console.log('testMe');
}

class KerasManager {
  constructor(modelPath, weightsPath, metaDataPath){
    this.model = new KerasJS.Model({
        filepaths: {
        model: modelPath,
        weights: weightsPath,
        metadata: metaDataPath
        },
        gpu: true
    });
  }

  set outputMap(map){
    // TODO: type check
    this._outputMap = map;
  }

  predictP(inputdata){
    //TODO: keyword should be dynamic, if the model is sequential
    // set it to input, else, lookup the model.json file and find the key name
    //TODO: inputData must match the input layer shape, else reject or transform
    const inputDataStruct = {
      // 'input_1': new Float32Array(newData)
      'input': inputdata
    }
    return this.model.ready()
    .then(()=>{
      
      this.model.predict(inputDataStruct)
      .then(output => {
        //TODO: map output if outputmap exists
        console.log('output', output);
        return output;
      });;
    })
    .catch(err => {console.log("ERROR:", err);});


    }
}