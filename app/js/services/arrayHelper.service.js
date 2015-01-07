'use strict';

App.service('ArrayHelper', function(){
  return {
    shiftData: function(array, value){
      array.push(value);
      array.splice(0, 1); 
      return array;
    },
    zeroArray: function(length){
      return Array.apply(null, new Array(length)).map(Number.prototype.valueOf,0);
    },
    stringValueArray: function(length, value){
       return Array.apply(null, new Array(length)).map(String.prototype.valueOf, value.toString());
    },
  };
});