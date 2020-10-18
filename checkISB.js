function checkISB() {
  
  document.getElementsByClassName("loader")[2].style.display = "none";

  var input = document.querySelector("#input3").value;
  input = input.trim();
  var indx = input.indexOf("/reports/")+"/reports/".length;
  if (input.length>16)
    input = input.slice(indx,indx+16);
  else if (input.length<16) {
    document.getElementById("page3").innerHTML = "Error, invalid report ID.";
    return
  }
  
  document.getElementById("page3").innerHTML = "Code stopped for some reason";
  
  var logID = input.trim(); console.log("'" + logID + "'")
  var API = "&api_key=120a438a467e97b900a062c8a7a34000";
  var baseURL = "https://classic.warcraftlogs.com:443/v1/report";
  
  //encounterID!=0 AND target.id in (12118,11982,12259,12057,12056,12264,12098,11988,11502,10184,12435,13020,12017,11983,14601,11981,14020,11583,14507,14517,14510,11382,15082,14509,15114,14515,11380,14834,15348,15341,15340,15370,15369,15339,15263,15543,15511,15544,15516,15510,15299,15509,15276,15517,15589,15727)
  var filter = "&filter=encounterID%21%3D0%20AND%20target.id%20in%20%2812118%2C11982%2C12259%2C12057%2C12056%2C12264%2C12098%2C11988%2C11502%2C10184%2C12435%2C13020%2C12017%2C11983%2C14601%2C11981%2C14020%2C11583%2C14507%2C14517%2C14510%2C11382%2C15082%2C14509%2C15114%2C14515%2C11380%2C14834%2C15348%2C15341%2C15340%2C15370%2C15369%2C15339%2C15263%2C15543%2C15511%2C15544%2C15516%2C15510%2C15299%2C15509%2C15276%2C15517%2C15589%2C15727%29";
  try {
    var fightData = new XMLHttpRequest();
    fightData.open("Get", baseURL + "/fights/" + logID + "?" + API.slice(1,API.length), false);
    fightData.send(null);
    fightData = JSON.parse(fightData.response);
    var debuffData = new XMLHttpRequest();
    debuffData.open("Get", baseURL + "/events/debuffs/" + logID + "?start=0&end=100000000&hostility=1&abilityid=17800&wipes=2" + filter + API, false);
    debuffData.send(null);
    debuffData = JSON.parse(debuffData.response);
  
    var nextTime = debuffData.nextPageTimestamp;
    while (nextTime>1) {
      var dataadd = new XMLHttpRequest();
      dataadd.open("Get", baseURL + "/events/debuffs/" + logID + "?start=" + nextTime + "&end=100000000&hostility=1&abilityid=17800&wipes=2" + filter + API, false);
      dataadd.send(null);
      dataadd = JSON.parse(dataadd.response);
      debuffData.events = debuffData.events.concat(dataadd.events);
      nextTime = dataadd.nextPageTimestamp;
    }
  }
  catch(err) {
    document.getElementById("page3").innerHTML = "Error: " + err.message; 
    return
  }
  
  console.log(debuffData)
  
}
