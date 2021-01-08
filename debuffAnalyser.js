function processInput() {
  
  document.getElementsByClassName("loader")[0].style.display = "none";
  
  var input = document.querySelector("#input").value;
  input = input.trim();
  var indx = input.indexOf("/reports/")+"/reports/".length;
  if (input.length>16)
    input = input.slice(indx,indx+16);
  else if (input.length<16) {
    document.getElementById("page").innerHTML = "Error, invalid report ID.";
    return
  }
  
  document.getElementById("page").innerHTML = "Code stopped for some reason";
  
  var logID = input.trim(); console.log("'" + logID + "'")
  var API = "&api_key=120a438a467e97b900a062c8a7a34000";

  var baseURL = "https://classic.warcraftlogs.com:443/v1/report";
  //var filter = "&filter=encounterID%21%3D0"; 
  //encounterID!=0 AND type in ("applydebuff","removedebuff") AND ability.name not in ("Deep Wound","Fireball","Pyroblast") AND target.id in (12118,11982,12259,12057,12056,12264,12098,11988,11502,10184,12435,13020,12017,11983,14601,11981,14020,11583,14507,14517,14510,11382,15082,14509,15114,14515,11380,14834,15348,15341,15340,15370,15369,15339,15263,15543,15511,15544,15516,15510,15299,15509,15276,15517,15589,15727,15956,15953,15952,15954,15936,16011,16061,16060,16064,16065,16062,16063,16028,15931,15932,15928,15989,15990)
  //var filter = "&filter=encounterID%21%3D0%20AND%20type%20in%20%28%22applydebuff%22%2C%22removedebuff%22%29%20AND%20ability.name%20not%20in%20%28%22Deep%20Wound%22%2C%22Fireball%22%2C%22Pyroblast%22%29%20AND%20target.id%20in%20%2812118%2C11982%2C12259%2C12057%2C12056%2C12264%2C12098%2C11988%2C11502%2C10184%2C12435%2C13020%2C12017%2C11983%2C14601%2C11981%2C14020%2C11583%2C14507%2C14517%2C14510%2C11382%2C15082%2C14509%2C15114%2C14515%2C11380%2C14834%2C15348%2C15341%2C15340%2C15370%2C15369%2C15339%2C15263%2C15543%2C15511%2C15544%2C15516%2C15510%2C15299%2C15509%2C15276%2C15517%2C15589%2C15727%2C15956%2C15953%2C15952%2C15954%2C15936%2C16011%2C16061%2C16060%2C16064%2C16065%2C16062%2C16063%2C16028%2C15931%2C15932%2C15928%2C15989%2C15990%29";
  //encounterID!=0 AND type in ("applydebuff","removedebuff") AND ability.id not in ("12721","25306","18809") AND target.id in (12118,11982,12259,12057,12056,12264,12098,11988,11502,10184,12435,13020,12017,11983,14601,11981,14020,11583,14507,14517,14510,11382,15082,14509,15114,14515,11380,14834,15348,15341,15340,15370,15369,15339,15263,15543,15511,15544,15516,15510,15299,15509,15276,15517,15589,15727,15956,15953,15952,15954,15936,16011,16061,16060,16064,16065,16062,16063,16028,15931,15932,15928,15989,15990)
  var filter = "&filter=encounterID%21%3D0%20AND%20type%20in%20%28%22applydebuff%22%2C%22removedebuff%22%29%20AND%20ability.id%20not%20in%20%28%2212721%22%2C%2225306%22%2C%2218809%22%29%20AND%20target.id%20in%20%2812118%2C11982%2C12259%2C12057%2C12056%2C12264%2C12098%2C11988%2C11502%2C10184%2C12435%2C13020%2C12017%2C11983%2C14601%2C11981%2C14020%2C11583%2C14507%2C14517%2C14510%2C11382%2C15082%2C14509%2C15114%2C14515%2C11380%2C14834%2C15348%2C15341%2C15340%2C15370%2C15369%2C15339%2C15263%2C15543%2C15511%2C15544%2C15516%2C15510%2C15299%2C15509%2C15276%2C15517%2C15589%2C15727%2C15956%2C15953%2C15952%2C15954%2C15936%2C16011%2C16061%2C16060%2C16064%2C16065%2C16062%2C16063%2C16028%2C15931%2C15932%2C15928%2C15989%2C15990%29";
  try {
    var fightData = new XMLHttpRequest();
    fightData.open("Get", baseURL + "/fights/" + logID + "?" + API.slice(1,API.length), false);
    fightData.send(null);
    fightData = JSON.parse(fightData.response);
    var debuffData = new XMLHttpRequest();
    debuffData.open("Get", baseURL + "/events/debuffs/" + logID + "?start=0&end=100000000&hostility=1&wipes=2" + filter + API, false);
    debuffData.send(null);
    debuffData = JSON.parse(debuffData.response);
  
    var nextTime = debuffData.nextPageTimestamp;
    while (nextTime>1) {
      var dataadd = new XMLHttpRequest();
      dataadd.open("Get", baseURL + "/events/debuffs/" + logID + "?start=" + nextTime + "&end=100000000&hostility=1&wipes=2" + filter + API, false);
      dataadd.send(null);
      dataadd = JSON.parse(dataadd.response);
      debuffData.events = debuffData.events.concat(dataadd.events);
      nextTime = dataadd.nextPageTimestamp;
    }
  }
  catch(err) {
    document.getElementById("page").innerHTML = "Error: " + err.message; 
    return
  }
  console.log(debuffData)
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
  
  var debuffEdit = debuffData.events; 
  var index = new Array;
  for (var i=debuffEdit.length-1; i>=0; i--) {
    if (bossIDs.indexOf(debuffEdit[i].targetID) == -1 || debuffEdit[i].type == "removedebuffstack" || debuffEdit[i].type == "applydebuffstack" || debuffEdit[i].type == "refreshdebuff") {
      debuffEdit.splice(i,1);}
    else if (debuffEdit[i].type == "removedebuff" && debuffEdit[i].ability.name == "Mind Flay") {
      debuffEdit.splice(i,1);}
    else if (debuffEdit[i].type == "removedebuff" && debuffEdit[i].ability.name == "Rain of Fire") {
      debuffEdit.splice(i,1);}
    else if (debuffEdit[i].type == "removedebuff" && debuffEdit[i].ability.name == "Blizzard") {
      debuffEdit.splice(i,1);}
    else if (debuffEdit[i].type == "removedebuff" && debuffEdit[i].ability.name == "Consecration") {
      debuffEdit.splice(i,1);}
    else if (debuffEdit[i].type == "removedebuff" && debuffEdit[i].ability.name == "Hellfire") {
      debuffEdit.splice(i,1);}
    else {
      for (var j=0; j<bossStarts.length; j++) {
        if (debuffEdit[i].timestamp>bossEnds[j]-1000 && debuffEdit[i].timestamp<bossEnds[j]+1000) {     
          debuffEdit.splice(i,1);
          break
        }
      }      
    }
  }
  
  var timestampList = new Array;
  count = 0;
  for (var i=0; i<debuffEdit.length; i++) {
    if (debuffEdit[i].type == "removedebuff") {
      timestampList[count] = debuffEdit[i].timestamp;
      count++
    }
  }
  
  for (var i=debuffEdit.length-1; i>=0; i--) {
    count = 0;
    for (var j=0; j<timestampList.length; j++) {
      if (debuffEdit[i].timestamp == timestampList[j])
        count++;
    }
    if (count < 1)
      debuffEdit.splice(i,1);
  }
  
  for (var k=1; k<=5; k++) {
    for (var i=debuffEdit.length-1; i>=0; i--) {
      if (i == debuffEdit.length-1) {
        if (debuffEdit[i].type == "removedebuff")
          debuffEdit.splice(i,1);
      }
      else if (i == 0) {
        if (debuffEdit[i].type == "applydebuff")
          debuffEdit.splice(i,1);
      }
      else if (debuffEdit[i].type == "removedebuff" && debuffEdit[i].timestamp<debuffEdit[i+1].timestamp)
        debuffEdit.splice(i,1);
      else if (debuffEdit[i].type == "applydebuff" && debuffEdit[i].timestamp>debuffEdit[i-1].timestamp)
        debuffEdit.splice(i,1);
    }
    
    var timestampList = new Array;
    for (var i=0; i<debuffEdit.length; i++) {
      timestampList[i] = debuffEdit[i].timestamp;
    }
    
    for (var i=debuffEdit.length-1; i>=0; i--) {
      count = 0;
      for (var j=0; j<timestampList.length; j++) {
        if (debuffEdit[i].timestamp == timestampList[j])
          count++;
      }
      if (count < 2)
        debuffEdit.splice(i,1);
    }
  }
  
  for (var k=1; k<=5; k++) {
    for (var i=1; i<debuffEdit.length; i++) {
      if (debuffEdit[i].ability.name == "Faerie Fire (Feral)") {
        debuffEdit[i].ability.name = "Faerie Fire";}
      if (debuffEdit[i].type == "removedebuff" && debuffEdit[i].timestamp == debuffEdit[i-1].timestamp && debuffEdit[i-1].type == "applydebuff") {
        for (j=i; j<=i+10; j++) {
          if (j<debuffEdit.length)
            if (debuffEdit[j].timestamp == debuffEdit[i-1].timestamp)
              debuffEdit[j].timestamp = debuffEdit[j].timestamp + 1;
        }
      }
    }
  }
  
  var timestampList = new Array;
  for (var i=0; i<debuffEdit.length; i++) {
    timestampList[i] = debuffEdit[i].timestamp;
  }
  
  var uniqueStamps = timestampList.filter(onlyUnique);
  var currentBoss = "None";
  var currentStart = 0;
  var idx = 0;
  var timeAt = 0;
  var output = new Array;
  var rb = "</td><td>" + "&nbsp removed by &nbsp" + "</td>";
  var tdtr = "</td></tr>";
  var debuffOne = "";
  var debuffTwo = "";
  output[0] = "<table><tr><th colspan='4' style='text-align:left'>" + "Report ID: " + logID + "</th></tr>";
  count = 0;
  for (var i=0; i<uniqueStamps.length; i++) {
    idx = timestampList.indexOf(uniqueStamps[i]);

    for (var j=0; j<bossNames.length; j++) {
      if (uniqueStamps[i]>bossStarts[j] && uniqueStamps[i]<bossEnds[j] && bossNames[j]!==currentBoss) {
        currentBoss = bossNames[j];
        currentStart = bossStarts[j];
        if (i!==0) 
          output += ("<tr><th colspan='4'></th></tr>")
        output += ("<tr><th colspan='4'>" + currentBoss + " (" + Math.round((bossEnds[j]-bossStarts[j])/1000) + "s fight)" + "</th></tr>")
        //console.log(" ")
        //console.log("--- " + currentBoss + ", with a duration of " + (bossEnds[j]-bossStarts[j])/1000 + " seconds ---")
      }
    }
    
    count = 0;
    for (var j=0; j<timestampList.length; j++) {
      if (uniqueStamps[i]==timestampList[j])
        count++;
    }
    
    debuffOne = classColor(idx,"right");
    debuffTwo = classColor(idx+1,"left");
    
    timeAt = "<tr><td style='text-align:right'>" + formatNumber((debuffEdit[idx].timestamp-currentStart)/1000) + ":</td>"; //<td style='text-align:right'>
    if (count==2) {
      if (debuffEdit[idx].type == "removedebuff" && debuffEdit[idx+1].type == "applydebuff") {
        if (debuffEdit[idx].ability.name!==debuffEdit[idx+1].ability.name)
          if (debuffEdit[idx].ability.name!=="Mind Flay" || debuffEdit[idx+1].ability.name!=="Shadow Word: Pain")
            if (debuffEdit[idx].ability.name!=="Shadow Vulnerability" || debuffEdit[idx+1].ability.name!=="Mind Flay")
              if (debuffEdit[idx].ability.name!=="Sunder Armor" || debuffEdit[idx+1].ability.name!=="Expose Armor")
                if (debuffEdit[idx].targetID == debuffEdit[idx+1].targetID)
                  output += (timeAt + debuffOne + rb + debuffTwo + tdtr);
      }
      else
        console.log(timeAt + ": Error, " + debuffEdit[idx].type + " " + debuffEdit[idx+1].type) 
    }
    
    else if (count==3) {
      if (debuffEdit[idx].type == "removedebuff" && debuffEdit[idx+1].type == "removedebuff" && debuffEdit[idx+2].type == "applydebuff") {
        if (debuffEdit[idx].ability.name == debuffEdit[idx+2].ability.name)
          output += (timeAt + classColor(idx+1,"right") + rb + "<td style='text-align:left'>Phantom Debuff (" + debuffEdit[idx+2].ability.name + ")" + tdtr);
        else if (debuffEdit[idx+1].ability.name == debuffEdit[idx+2].ability.name)
          output += (timeAt + debuffOne + rb + "<td style='text-align:left'>Phantom Debuff (" + debuffEdit[idx+2].ability.name + ")" + tdtr);
        else if (debuffEdit[idx+1].ability.name == "Hammer of Justice" && debuffEdit[idx+2].ability.name == "Kidney Shot")
          output += (timeAt + debuffOne + rb + "<td style='text-align:left'>Phantom Debuff (" + debuffEdit[idx+1].ability.name + "/" + debuffEdit[idx+2].ability.name + ")" + tdtr);
        else if (debuffEdit[idx+1].ability.name == "Kidney Shot" && debuffEdit[idx+2].ability.name == "Hammer of Justice")
          output += (timeAt + debuffOne + rb + "<td style='text-align:left'>Phantom Debuff (" + debuffEdit[idx+1].ability.name + "/" + debuffEdit[idx+2].ability.name + ")" + tdtr);
        else if (debuffEdit[idx+1].ability.name == "Sunder Armor" && debuffEdit[idx+2].ability.name == "Expose Armor")
          output += (timeAt + debuffOne + rb + "<td style='text-align:left'>Phantom Debuff (" + debuffEdit[idx+1].ability.name + "/" + debuffEdit[idx+2].ability.name + ")" + tdtr);
        else if (debuffEdit[idx].ability.name == "Sunder Armor" && debuffEdit[idx+2].ability.name == "Expose Armor")
          output += (timeAt + classColor(idx+1,"right") + rb + "<td style='text-align:left'>Phantom Debuff (" + debuffEdit[idx].ability.name + "/" + debuffEdit[idx+2].ability.name + ")" + tdtr);
        else
          output += (timeAt + debuffOne + " and " + debuffEdit[idx+1].ability.name + rb + "<td style='text-align:left'>" + debuffEdit[idx+2].ability.name + tdtr);
      }
      else if (debuffEdit[idx].type == "removedebuff" && debuffEdit[idx+1].type == "applydebuff" && debuffEdit[idx+2].type == "applydebuff") {
        if (debuffEdit[idx].ability.name !== debuffEdit[idx+1].ability.name && debuffEdit[idx].ability.name !== debuffEdit[idx+2].ability.name)
          if (debuffEdit[idx].ability.name !== "Sunder Armor")
            output += (timeAt + debuffOne + rb + "<td style='text-align:left'>" + debuffEdit[idx+1].ability.name + " or " + debuffEdit[idx+2].ability.name + tdtr);
      }
      else 
        console.log(timeAt + ": Error, " + debuffEdit[idx].type + " " + debuffEdit[idx+1].type + " " + debuffEdit[idx+2].type)
    }
    
    else if (count==4) {
      if (debuffEdit[idx].type == "removedebuff" && debuffEdit[idx+1].type == "applydebuff" && debuffEdit[idx+2].type == "applydebuff" && debuffEdit[idx+3].type == "applydebuff") {
        if (debuffEdit[idx].ability.name !== debuffEdit[idx+1].ability.name && debuffEdit[idx].ability.name !== debuffEdit[idx+2].ability.name && debuffEdit[idx].ability.name !== debuffEdit[idx+3].ability.name)
          output += (timeAt + debuffOne + rb + "<td style='text-align:left'>" + debuffEdit[idx+1].ability.name + " or " + debuffEdit[idx+2].ability.name + " or " + debuffEdit[idx+3].ability.name + tdtr)
      }
      else if (debuffEdit[idx].type == "removedebuff" && debuffEdit[idx+1].type == "removedebuff" && debuffEdit[idx+2].type == "applydebuff" && debuffEdit[idx+3].type == "applydebuff") {
        console.log(timeAt + ": " + debuffEdit[idx].ability.name + " & " + debuffEdit[idx+1].ability.name + " removed by " + debuffEdit[idx+2].ability.name + " & " + debuffEdit[idx+3].ability.name)
      }
      else 
        console.log(timeAt + ": Error, " + debuffEdit[idx].type + " " + debuffEdit[idx+1].type + " " + debuffEdit[idx+2].type + " " + debuffEdit[idx+3].type)
    }
    
    else if (count==5) {
      if (debuffEdit[idx].type == "removedebuff" && debuffEdit[idx+1].type == "applydebuff" && debuffEdit[idx+2].type == "applydebuff" && debuffEdit[idx+3].type == "applydebuff" && debuffEdit[idx+4].type == "applydebuff") {
        if (debuffEdit[idx].ability.name !== debuffEdit[idx+1].ability.name && debuffEdit[idx].ability.name !== debuffEdit[idx+2].ability.name && debuffEdit[idx].ability.name !== debuffEdit[idx+3].ability.name && debuffEdit[idx].ability.name !== debuffEdit[idx+4].ability.name)
          output += (timeAt + debuffOne + rb + "<td style='text-align:left'>" + debuffEdit[idx+1].ability.name + " or " + debuffEdit[idx+2].ability.name + " or " + debuffEdit[idx+3].ability.name + " or " + debuffEdit[idx+4].ability.name + tdtr)
      }
      else 
        console.log(timeAt + ": Error, " + debuffEdit[idx].type + " " + debuffEdit[idx+1].type + " " + debuffEdit[idx+2].type + " " + debuffEdit[idx+3].type + " " + debuffEdit[idx+4].type)
    }
    
    else
       console.log(timeAt + ": Error, " + count)
  }
  document.getElementById("page").innerHTML = output + "<tr> <td><div style='width: 70px'></div></td> <td><div style='width: 180px'></div></td> <td><div style='width: 100px'></div></td> <td><div style='width: 250px'></div></td> </tr></table>";
  console.log(bossNames)
  console.log(bossStarts)
  console.log(bossEnds)
  console.log(uniqueStamps)
  console.log(timestampList)
  console.log(fightData)
  console.log(debuffEdit)
  
  function classColor(idx,alignment) {
    try {
      var who = fightData.friendlies[friendIDs.indexOf(debuffEdit[idx].sourceID)];
      var pet = false;
      var spec = who.type;
    }
    catch {
      try {
        var who = fightData.friendlies[friendIDs.indexOf(fightData.friendlyPets[petIDs.indexOf(debuffEdit[idx].sourceID)].petOwner)];
        var pet = true;
        var spec = who.type;
      }
      catch {
        var cellString = "<td>" + "Unknown's " + debuffEdit[idx].ability.name;
        return cellString
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

    if (pet == false)
      var cellString = "<td style=" + colorName + ">" + who.name + "'s " + debuffEdit[idx].ability.name;
    else if (pet == true)
      var cellString = "<td style=" + colorName + ">" + who.name + "'s Pet's " + debuffEdit[idx].ability.name;
    
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


