setColorForSegments = function(segments){
  block.setValue = function(value) {
    this.value = value    
    setGreenLines(value, segments)
    setWhiteLines(value, segments)
  }
}

setGreenLines = function(value, segments){
  for (i = 0; i < 7; i++) 
    this.line[i].style.backgroundColor = "green"      
}

setWhiteLines = function(value, segments){
  for (i in segments[value]) 
    this.line[segments[value][i]].style.backgroundColor = "white"
}