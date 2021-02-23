function buffCheck() {
  
  document.getElementsByClassName("loader")[3].style.display = "none";
  
  var input = document.querySelector("#input4").value;
  input = input.trim();
  var indx = input.indexOf("/reports/")+"/reports/".length;
  if (input.length>16)
    input = input.slice(indx,indx+16);
  else if (input.length<16) {
    document.getElementById("page4").innerHTML = "Error, invalid report ID.";
    return
  }
  
  document.getElementById("page4").innerHTML = "Code stopped for some reason";
  
  var logID = input.trim(); console.log("'" + logID + "'")
  var API = "&api_key=120a438a467e97b900a062c8a7a34000";

  var baseURL = "https://classic.warcraftlogs.com:443/v1/report";
  //var filter = "&filter=type%20in%20%28%22applybuff%22%2C%22removebuff%22%29";
  //type in ("removebuff") AND ability.id in (17538,3593,16609,15366,24425,22817,22818,22820,23768,22888,24382,11349,11348) - Mongoose, Fortitude II, Rend, SF, ZG, DMTAP, DMTHP, DMTSC, DMF, Ony, Zanza, DefPot, SupDef
  var filter = "&filter=type%20in%20%28%22removebuff%22%29%20AND%20ability.id%20in%20%2817538%2C3593%2C16609%2C15366%2C24425%2C22817%2C22818%2C22820%2C23768%2C22888%2C24382%2C11349%2C11348%29";
  try {
    var fightData = new XMLHttpRequest();
    fightData.open("Get", baseURL + "/fights/" + logID + "?" + API.slice(1,API.length), false);
    fightData.send(null);
    fightData = JSON.parse(fightData.response);
    
    var buffData = new XMLHttpRequest();
    buffData.open("Get", baseURL + "/events/buffs/" + logID + "?start=0&end=1000000000&wipes=2" + filter + API, false);
    buffData.send(null);
    buffData = JSON.parse(buffData.response);
    
    var nextTime = buffData.nextPageTimestamp;
    while (nextTime>1) {
      var dataadd = new XMLHttpRequest();
      dataadd.open("Get", baseURL + "/events/buffs/" + logID + "?start=" + nextTime + "&end=1000000000&wipes=2" + filter + API, false);
      dataadd.send(null);
      dataadd = JSON.parse(dataadd.response);
      buffData.events = buffData.events.concat(dataadd.events);
      nextTime = dataadd.nextPageTimestamp;
    }
  }
  catch(err) {
    document.getElementById("page4").innerHTML = "Error: " + err.message; 
    return
  }
  console.log(buffData)
  var bossIDs = new Array;
  var enemyIDs = new Array;
  var count = 0;
  for (var i=0; i<fightData.enemies.length; i++) {
    bossIDs[count] = fightData.enemies[i].id; 
    count++
    enemyIDs[i] = fightData.enemies[i].id;
  }
  var friendIDs = new Array;
  for (var i=0; i<fightData.friendlies.length; i++) {
    friendIDs[i] = fightData.friendlies[i].id;
  }

  var petIDs = new Array;
  for (var i=0; i<fightData.friendlyPets.length; i++) {
    petIDs[i] = fightData.friendlyPets[i].id;
  }

  var bossStarts = new Array;
  var bossEnds = new Array;
  var bossNames = new Array;
  var val = 0;
  var temp = new Array;
  count = 0;
  for (var i=0; i<bossIDs.length; i++) {
    val = bossIDs[i];
    temp = fightData.enemies[enemyIDs.indexOf(val)].fights;
    if (temp.length > 1) { // Handle boss fights with adds better, loatheb fight wasn't being displayed without this
      for (var j=0; j < temp.length; j++) {
        bossNames[count]  = fightData.fights[fightData.enemies[enemyIDs.indexOf(val)].fights[j].id-1].name;
        bossStarts[count] = fightData.fights[fightData.enemies[enemyIDs.indexOf(val)].fights[j].id-1].start_time;
        bossEnds[count]   = fightData.fights[fightData.enemies[enemyIDs.indexOf(val)].fights[j].id-1].end_time;
        count++
      }
    }
    else {
      bossNames[count]  = fightData.fights[fightData.enemies[enemyIDs.indexOf(val)].fights[temp.length-1].id-1].name;
      bossStarts[count] = fightData.fights[fightData.enemies[enemyIDs.indexOf(val)].fights[temp.length-1].id-1].start_time;
      bossEnds[count]   = fightData.fights[fightData.enemies[enemyIDs.indexOf(val)].fights[temp.length-1].id-1].end_time;
      count++
    }
  }
  
  var buffEdit = buffData.events; 
  var index = new Array;
  var timestampList = new Array;
  count = 0;
  for (var i=0; i<buffEdit.length; i++) {
    if (buffEdit[i].type == "removebuff") {
      timestampList[count] = buffEdit[i].timestamp;
      count++
    }
  }

  var timestampList = new Array;
  for (var i=0; i<buffEdit.length; i++) {
    timestampList[i] = buffEdit[i].timestamp;
  }
  
  var uniqueStamps = timestampList.filter(onlyUnique);
  var currentBoss = "None";
  var currentStart = 0;
  var currentDuration = 0;
  var firstTime = fightData.fights[0].start_time;
  var idx = 0;
  var timeAt = 0;
  var timeTotal = 0;
  var output = new Array;
  var rb = "</td><td>" + "&nbsp faded away by &nbsp" + "</td>";
  var tdtr = "</td></tr>";
  var buffOne = "";
  var buffTwo = "";
  var shortBuffs = [17538,3593,16609,15366,11349,11348];// - Mongoose, Fortitude II, Rend, SF, DefPot, SupDef
  output[0] = "<table><tr><th colspan='5' style='text-align:left'>" + "Report ID: " + logID + ",&nbsp &nbsp''" + fightData.title + "'' uploaded by " + fightData.owner + "</th></tr>";
  count = 0;
  for (var i=0; i<timestampList.length; i++) {
    idx = i;//timestampList.indexOf(uniqueStamps[i]);
    
    if ((buffEdit[idx].timestamp-firstTime)/1000 > 5400)
      break
    else if ((buffEdit[idx].timestamp-firstTime)/1000 > 2700 && shortBuffs.contains(buffEdit[idx].ability.guid))
      continue
    
    for (var j=0; j<bossNames.length; j++) {
      if (timestampList[i]>bossStarts[j] && timestampList[i]<bossEnds[j] && (buffEdit[idx].timestamp-currentStart)>currentDuration) {
        currentBoss = bossNames[j];
        currentStart = bossStarts[j];
        currentDuration = bossEnds[j]-bossStarts[j];
        if (i == 0) {
          output += ("<tr><th>Total Time</th><th>Fight Time</th><th colspan='3'>" + currentBoss + " (" + Math.round((bossEnds[j]-bossStarts[j])/1000) + "s fight)" + "</th></tr>")
        }
        else if (i !== 0) {
          output += ("<tr><th colspan='5'></th></tr>")
          output += ("<tr><th colspan='2'></th><th colspan='3'>" + currentBoss + " (" + Math.round((bossEnds[j]-bossStarts[j])/1000) + "s fight)" + "</th></tr>")
        }
      }
    }
    
    timeTotal = "<tr><td style='text-align:right'>" + formatTime((buffEdit[idx].timestamp-firstTime)/1000) + ":</td>";
    timeAt = timeTotal + "<td style='text-align:right'>" + formatNumber((buffEdit[idx].timestamp-currentStart)/1000) + ":</td>";
    buffOne = classColor(idx,"center");
    output += (timeAt + buffOne + tdtr);
  }
  document.getElementById("page4").innerHTML = output + "<tr> <td><div style='width: 70px'></div></td> <td><div style='width: 70px'></div></td> <td><div style='width: 180px'></div></td> <td><div style='width: 100px'></div></td> <td><div style='width: 250px'></div></td> </tr></table>";
  /*console.log(bossNames)
  console.log(bossStarts)
  console.log(bossEnds)
  console.log(uniqueStamps)
  console.log(timestampList)*/
  console.log(fightData)
  console.log(buffEdit)
  
  // Functions
  function classColor(idx,alignment) {
    if (alignment == "right") {
      try {
        var who = fightData.friendlies[friendIDs.indexOf(buffEdit[idx].targetID)];
        var pet = false;
        var spec = who.type;
      }
      catch {
        try {
          var who = fightData.friendlies[friendIDs.indexOf(fightData.friendlyPets[petIDs.indexOf(buffEdit[idx].targetID)].petOwner)];
          var pet = true;
          var spec = who.type;
        }
        catch {
          var cellString = "<td>" + "Unknown's " + buffEdit[idx].ability.name;
          return cellString
        }
      }
    }
    else if (alignment == "left") {
      try {
        var who = fightData.friendlies[friendIDs.indexOf(buffEdit[idx].sourceID)];
        var pet = false;
        var spec = who.type;
      }
      catch {
        try {
          var who = fightData.friendlies[friendIDs.indexOf(fightData.friendlyPets[petIDs.indexOf(buffEdit[idx].sourceID)].petOwner)];
          var pet = true;
          var spec = who.type;
        }
        catch {
          var cellString = "<td>" + "Unknown's " + buffEdit[idx].ability.name;
          return cellString
        }
      }
    }
    else if (alignment == "center") {
      try {
        var who = fightData.friendlies[friendIDs.indexOf(buffEdit[idx].targetID)];
        var pet = false;
        var spec = who.type;
      }
      catch {
        try {
          var who = fightData.friendlies[friendIDs.indexOf(fightData.friendlyPets[petIDs.indexOf(buffEdit[idx].targetID)].petOwner)];
          var pet = true;
          var spec = who.type;
        }
        catch {
          var cellString = "<td>" + "Unknown's " + buffEdit[idx].ability.name;
          return cellString
        }
      }
    }
      
    
    var preString = "text-align:" + alignment + ";color:"
    if (spec == "Warrior")
      var colorName = preString + "#C79C6E";
    else if (spec == "Rogue")
      var colorName = preString + "#FFF569";
    else if (spec == "Hunter")
      var colorName = preString + "#ABD473";
    else if (spec == "Mage")
      var colorName = preString + "#69CCF0";
    else if (spec == "Warlock")
      var colorName = preString + "#9482C9";
    else if (spec == "Druid")
      var colorName = preString + "#FF7D0A";
    else if (spec == "Priest")
      var colorName = preString + "#FFFFFF";
    else if (spec == "Paladin")
      var colorName = preString + "#F58CBA";
    else if (spec == "Shaman")
      var colorName = preString + "#0070DE";
    
    if (alignment == "center") {
      if (pet == false)
        var cellString = "<td colspan='3' style=" + colorName + ">" + who.name + "'s " + buffEdit[idx].ability.name + " faded away";
      else if (pet == true)
        var cellString = "<td colspan='3' style=" + colorName + ">" + who.name + "'s Pet's " + buffEdit[idx].ability.name + " faded away";
    }
    else {
      if (pet == false)
        var cellString = "<td style=" + colorName + ">" + who.name + "'s " + buffEdit[idx].ability.name;
      else if (pet == true)
        var cellString = "<td style=" + colorName + ">" + who.name + "'s Pet's " + buffEdit[idx].ability.name;
    }
    
    return cellString
  }
  
}


function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}


function formatNumber(value) {
  value = value.toString();
  for (var k=1; k<=5; k++)
    if (value.indexOf(".")<3)
      value = "&nbsp" + value;
  for (var k=1; k<=5; k++)
    if (value.length<value.indexOf(".")+4)
      value += "0";
  return value
}

function formatTime(value) {
  var hours = Math.floor(value/3600);
  var minutes = Math.floor((value/3600-hours)*60);
  if (minutes < 10)
    minutes = "0" + minutes;
  var seconds = Math.floor(((value/3600-hours)*60-minutes)*60);
  if (seconds < 10)
    seconds = "0" + seconds;
  var string = hours + "h" + minutes + "m" + seconds + "s";
  return string
}
