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
  //encounterID!=0 AND ability.name in ("Shadow Bolt","Shoot","Mind Blast","Death Coil","Shadowburn") AND target.id in (12118,11982,12259,12057,12056,12264,12098,11988,11502,10184,12435,13020,12017,11983,14601,11981,14020,11583,14507,14517,14510,11382,15082,14509,15114,14515,11380,14834,15348,15341,15340,15370,15369,15339,15263,15543,15511,15544,15516,15510,15299,15509,15276,15517,15589,15727)
  var filtertwo = "&filter=encounterID%21%3D0%20AND%20ability.name%20in%20%28%22Shadow%20Bolt%22%2C%22Shoot%22%2C%22Mind%20Blast%22%2C%22Death%20Coil%22%2C%22Shadowburn%22%29%20AND%20target.id%20in%20%2812118%2C11982%2C12259%2C12057%2C12056%2C12264%2C12098%2C11988%2C11502%2C10184%2C12435%2C13020%2C12017%2C11983%2C14601%2C11981%2C14020%2C11583%2C14507%2C14517%2C14510%2C11382%2C15082%2C14509%2C15114%2C14515%2C11380%2C14834%2C15348%2C15341%2C15340%2C15370%2C15369%2C15339%2C15263%2C15543%2C15511%2C15544%2C15516%2C15510%2C15299%2C15509%2C15276%2C15517%2C15589%2C15727%29";
  //encounterID!=0 AND ability.name in ("Shadow Bolt","Mind Blast","Death Coil","Shadowburn") AND target.id in (12118,11982,12259,12057,12056,12264,12098,11988,11502,10184,12435,13020,12017,11983,14601,11981,14020,11583,14507,14517,14510,11382,15082,14509,15114,14515,11380,14834,15348,15341,15340,15370,15369,15339,15263,15543,15511,15544,15516,15510,15299,15509,15276,15517,15589,15727)
  var filterthree = "&filter=encounterID%21%3D0%20AND%20ability.name%20in%20%28%22Shadow%20Bolt%22%2C%22Mind%20Blast%22%2C%22Death%20Coil%22%2C%22Shadowburn%22%29%20AND%20target.id%20in%20%2812118%2C11982%2C12259%2C12057%2C12056%2C12264%2C12098%2C11988%2C11502%2C10184%2C12435%2C13020%2C12017%2C11983%2C14601%2C11981%2C14020%2C11583%2C14507%2C14517%2C14510%2C11382%2C15082%2C14509%2C15114%2C14515%2C11380%2C14834%2C15348%2C15341%2C15340%2C15370%2C15369%2C15339%2C15263%2C15543%2C15511%2C15544%2C15516%2C15510%2C15299%2C15509%2C15276%2C15517%2C15589%2C15727%29";
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
      
    var damageData = new XMLHttpRequest();
    damageData.open("Get", baseURL + "/events/damage-done/" + logID + "?start=0&end=100000000&wipes=2" + filtertwo + API, false);
    damageData.send(null);
    damageData = JSON.parse(damageData.response);
  
    var nextTime = damageData.nextPageTimestamp;
    while (nextTime>1) {
      var dataadd = new XMLHttpRequest();
      dataadd.open("Get", baseURL + "/events/damage-done/" + logID + "?start=" + nextTime + "&end=100000000&wipes=2" + filtertwo + API, false);
      dataadd.send(null);
      dataadd = JSON.parse(dataadd.response);
      damageData.events = damageData.events.concat(dataadd.events);
      nextTime = dataadd.nextPageTimestamp;
    }
    
    var castData = new XMLHttpRequest();
    castData.open("Get", baseURL + "/events/casts/" + logID + "?start=0&end=100000000&wipes=2" + filterthree + API, false);
    castData.send(null);
    castData = JSON.parse(castData.response);
  
    var nextTime = castData.nextPageTimestamp;
    while (nextTime>1) {
      var dataadd = new XMLHttpRequest();
      dataadd.open("Get", baseURL + "/events/casts/" + logID + "?start=" + nextTime + "&end=100000000&wipes=2" + filterthree + API, false);
      dataadd.send(null);
      dataadd = JSON.parse(dataadd.response);
      castData.events = castData.events.concat(dataadd.events);
      nextTime = dataadd.nextPageTimestamp;
    }
  }
  catch(err) {
    document.getElementById("page3").innerHTML = "Error: " + err.message; 
    return
  }
  
  var debuffEdit = debuffData.events;
  var damageEdit = damageData.events;
  var castEdit = castData.events;
  console.log(debuffEdit)
  console.log(damageEdit)
  console.log(castEdit)
  
  var bossIDs = new Array;
  var enemyIDs = new Array;
  var count = 0;
  for (var i=0; i<fightData.enemies.length; i++) {
    if (fightData.enemies[i].type == "Boss") {
      bossIDs[count] = fightData.enemies[i].id; 
      count++
    }
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
    bossNames[count]  = fightData.fights[fightData.enemies[enemyIDs.indexOf(val)].fights[temp.length-1].id-1].name;
    bossStarts[count] = fightData.fights[fightData.enemies[enemyIDs.indexOf(val)].fights[temp.length-1].id-1].start_time;
    bossEnds[count]   = fightData.fights[fightData.enemies[enemyIDs.indexOf(val)].fights[temp.length-1].id-1].end_time;
    count++
  }
  
  var ISBStarts = new Array;
  var ISBEnds = new Array;
  for (var i=0; i<debuffEdit.length; i++) {
    if (debuffEdit[i].type == "applydebuff") {
      if (ISBEnds.length<ISBStarts.length) {
        ISBEnds[ISBEnds.length] = debuffEdit[i].timestamp;
      }
      if (ISBStarts.length<ISBEnds.length) {
        ISBStarts[ISBStarts.length] = debuffEdit[i].timestamp;
      }
      ISBStarts[ISBStarts.length] = debuffEdit[i].timestamp;
    }
    if (debuffEdit[i].type == "removedebuff" && debuffEdit[i].stack == undefined)
      ISBEnds[ISBEnds.length] = debuffEdit[i].timestamp;
  }
  
  
  var timestampList = new Array;
  for (var i=0; i<castEdit.length; i++) {
    timestampList[i] = castEdit[i].timestamp;
  }
  
  var bossISB = new Array;
  for (var j=0; j<bossNames.length; j++) {
    var count = 0;
    var countISB = 0;
    for (var i=0; timestampList[i]<bossEnds[j]; i++) {
      if (timestampList[i]>bossStarts[j] && castEdit[i].ability.name == "Shadow Bolt") {
        count++;
        for (var k=0; k<ISBStarts.length; k++) {
          if (castEdit[i].timestamp>ISBStarts[k] && castEdit[i].timestamp<ISBEnds[k])
            countISB++
        }
      }
    }
    bossISB[j]=Math.round(countISB/count*100);
  }
  
  
  var timestampList = new Array;
  for (var i=0; i<damageEdit.length; i++) {
    timestampList[i] = damageEdit[i].timestamp;
  }
  
  var currentBoss = "None";
  var currentStart = 0;
  var timeAt = new String;
  var output = new Array;
  var ab = "</td><td>" + "&nbsp applied by &nbsp" + "</td>";
  var rb = "</td><td>" + "&nbsp removed by &nbsp" + "</td>";
  var tdtr = "</td></tr>";
  var who = new String;
  var remover = new String;
  output[0] = "<table><tr><th colspan='4' style='text-align:left'>" + "Report ID: " + logID + "</th></tr>";
  
  for (var i=0; i<debuffEdit.length; i++) {
    for (var j=0; j<bossNames.length; j++) {
      if (debuffEdit[i].timestamp>bossStarts[j] && debuffEdit[i].timestamp<bossEnds[j] && bossNames[j]!==currentBoss) {
        currentBoss = bossNames[j];
        currentStart = bossStarts[j];
        if (i!==0) {
          output += ("<tr><th colspan='4'></th></tr>")
        }
        output += ("<tr><th colspan='4'>" + currentBoss + " (" + Math.round((bossEnds[j]-bossStarts[j])/1000) + "s fight)<br>ISB Uptime: " + bossISB[j] + "%" + "</th></tr>")
        //output += ("<tr><td colspan='4'>" + "ISB Uptime: " + bossISB[j] + "%" + tdtr)
        //console.log(" ")
        //console.log("--- " + currentBoss + ", with a duration of " + (bossEnds[j]-bossStarts[j])/1000 + " seconds ---")
      }
    }
    
    timeAt = "<tr><td style='text-align:right'>" + formatNumber((debuffEdit[i].timestamp-currentStart)/1000) + ":</td>";
    
    if (debuffEdit[i].type == "applydebuff" || debuffEdit[i].type == "applydebuffstack") {
      who = fightData.friendlies[friendIDs.indexOf(debuffEdit[i].sourceID)];
      output += (timeAt + "<td style=text-align:right>Shadow Vulnerability" + ab + "<td style=text-align:left;color:#9482C9>" + who.name + tdtr)
      var appliedAt = debuffEdit[i].timestamp;
    }
    else {
      //remover = damageEdit[timestampList.indexOf(debuffEdit[i].timestamp)];
      remover = damageEdit[timestampList.indexOf(findClosest(debuffEdit[i].timestamp,timestampList))];
      if (i<debuffEdit.length-1 && debuffEdit[i].timestamp==debuffEdit[i+1].timestamp && debuffEdit[i].type == "removedebuff" && debuffEdit[i+1].type == "applydebuff") {}
      else if (Math.abs(remover.timestamp-debuffEdit[i].timestamp)<50) {
        try {
          who = fightData.friendlies[friendIDs.indexOf(remover.sourceID)];
          if (debuffEdit[i].stack == undefined) {
            debuffEdit[i].stack = 0;
          }
          
          if (who.type == "Warrior")
            var colorName = ";color:#C79C6E";
          else if (who.type == "Rogue")
            var colorName = ";color:#FFF569";
          else if (who.type == "Hunter")
            var colorName = ";color:#ABD473";
          else if (who.type == "Mage")
            var colorName = ";color:#69CCF0";
          else if (who.type == "Warlock")
            var colorName = ";color:#9482C9";
          else if (who.type == "Druid")
            var colorName = ";color:#FF7D0A";
          else if (who.type == "Priest")
            var colorName = ";color:#FFFFFF";
          else if (who.type == "Paladin")
            var colorName = ";color:#F58CBA";
          else if (who.type == "Shaman")
            var colorName = ";color:#0070DE";
          
          output += (timeAt + "<td style=text-align:right>ISB Stack (" + (debuffEdit[i].stack+1) + ")" + rb + "<td style=text-align:left" + colorName + ">" + who.name + "'s " + remover.ability.name + tdtr)
          timestampList[timestampList.indexOf(findClosest(debuffEdit[i].timestamp,timestampList))] = -1;
        }
        catch(err) {
          console.log(debuffEdit[i])
          console.log(currentBoss + " " + (debuffEdit[i].timestamp-currentStart)/1000 + " " + err)
        }
      }
      else if (debuffEdit[i].type == "removedebuff" && debuffEdit[i].timestamp > (appliedAt + 11500)) {}
      else if (currentBoss == "The Prophet Skeram" && debuffEdit[i].type == "removedebuff") {}
      else if (i<debuffEdit.length-1 && debuffEdit[i].type == "removedebuff" && debuffEdit[i].targetID!==debuffEdit[i+1].targetID) {}
      else if (i<debuffEdit.length-1 && debuffEdit[i].timestamp>debuffEdit[i+1].timestamp-15 && debuffEdit[i].type == "removedebuff" && debuffEdit[i+1].type == "applydebuff") {}
      //else if (i<debuffEdit.length-1 && debuffEdit[i].type == "removedebuff" && (debuffEdit[i].timestamp+60000)<debuffEdit[i+1].timestamp) {}
      else {
        console.log(debuffEdit[i])
        console.log(currentBoss + " " + (debuffEdit[i].timestamp-currentStart)/1000 + " else")
      }
    }
    
    
  }
  document.getElementById("page3").innerHTML = output + "<tr> <td><div style='width: 70px'></div></td> <td><div style='width: 180px'></div></td> <td><div style='width: 100px'></div></td> <td><div style='width: 250px'></div></td> </tr></table>";
  
  console.log(bossNames)
  console.log(bossStarts)
  console.log(bossEnds)
  console.log(ISBStarts)
  console.log(ISBEnds)
  console.log(bossISB)
}

var findClosest = function(x, arr) {
  var indexArr = arr.map(function(k) { return Math.abs(k - x) })
  var min = Math.min.apply(Math, indexArr)
  return arr[indexArr.indexOf(min)]
}
