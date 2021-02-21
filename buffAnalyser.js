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
  var filter = "&filter=type%20in%20%28%22applybuff%22%2C%22removebuff%22%29";
  //type in ("applybuff","removebuff") AND ability.id in (17538,3593,16609,15366,24425,22817,22818,22820,23768,22888,24382,11349,11348) - Mongoose, Fortitude II, Rend, SF, ZG, DMTAP, DMTHP, DMTSC, DMF, Ony, Zanza, DefPot, SupDef
  //var filter = "&filter=type%20in%20%28%22applybuff%22%2C%22removebuff%22%29";
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
    //if (fightData.enemies[i].type == "Boss") {
      bossIDs[count] = fightData.enemies[i].id; 
      count++
    //}
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
  for (var i=buffEdit.length-1; i>=0; i--) {
    if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.id !== (17538,3593,16609,15366,24425,22817,22818,22820,23768,22888,24382,11349,11348))
      buffEdit.splice(i,1);
    /*if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Flurry") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Bloodthirst") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Defensive Stance") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Battle Stance") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Berserker Stance") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Bloodrage") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Combustion") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Inspiration") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Battle Shout") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Greater Blessing of Wisdom") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Stealth") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Concentration Aura") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Aspect of the Hawk") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Divine Favor") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Nature Protection ") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Power Word: Shield") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Greater Blessing of Light") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Enrage") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Rejuvenation") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Aspect of the Cheetah") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Shield Block") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Furious Howl") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Clearcasting") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Ephemeral Power") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Chicken Fury") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Nature's Grace") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Aura of the Blue Dragon") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Power Word: Fortitude") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Greater Blessing of Salvation") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Holy Strength") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Holy Power") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Lay on Hands") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Aspect of the Pack") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Renew") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Prayer of Fortitude") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Power Infusion") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Fear Ward") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Evasion") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Blessing of Salvation") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Inner Focus") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Blade Flurry") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Greater Blessing of Kings") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Earthstrike") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Unstable Power") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Slice and Dice") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Sprint") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Devotion Aura") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Mend Pet") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Blessing of Protection") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Winterfall Firewater") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Adrenaline Rush") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Essence of Sapphiron") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Mana Shield") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Arcane Intellect") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Trueshot Aura") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Track Beasts") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Track Humanoids") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Greater Blessing of Might") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Gift of the Wild") {
      buffEdit.splice(i,1);}
    else if (buffEdit[i].type == "removebuff" && buffEdit[i].ability.name == "Mark of the Wild") {
      buffEdit.splice(i,1);}*/
  }
  
  var timestampList = new Array;
  count = 0;
  for (var i=0; i<buffEdit.length; i++) {
    if (buffEdit[i].type == "removebuff") {
      timestampList[count] = buffEdit[i].timestamp;
      count++
    }
  }
  
  for (var i=buffEdit.length-1; i>=0; i--) {
    count = 0;
    for (var j=0; j<timestampList.length; j++) {
      if (buffEdit[i].timestamp == timestampList[j])
        count++;
    }
    if (count < 1)
      buffEdit.splice(i,1);
  }
  return
  for (var k=1; k<=5; k++) {
    for (var i=buffEdit.length-1; i>=0; i--) {
      if (i == buffEdit.length-1) {
        if (buffEdit[i].type == "removebuff")
          buffEdit.splice(i,1);
      }
      else if (i == 0) {
        if (buffEdit[i].type == "applybuff")
          buffEdit.splice(i,1);
      }
      else if (buffEdit[i].type == "removebuff" && buffEdit[i].timestamp<buffEdit[i+1].timestamp)
        buffEdit.splice(i,1);
      else if (buffEdit[i].type == "applybuff" && buffEdit[i].timestamp>buffEdit[i-1].timestamp)
        buffEdit.splice(i,1);
    }
    
    var timestampList = new Array;
    for (var i=0; i<buffEdit.length; i++) {
      timestampList[i] = buffEdit[i].timestamp;
    }
    
    for (var i=buffEdit.length-1; i>=0; i--) {
      count = 0;
      for (var j=0; j<timestampList.length; j++) {
        if (buffEdit[i].timestamp == timestampList[j])
          count++;
      }
      if (count < 2)
        buffEdit.splice(i,1);
    }
  }
  
  for (var k=1; k<=5; k++) {
    for (var i=1; i<buffEdit.length; i++) {
      /*if (buffEdit[i].ability.name == "Faerie Fire (Feral)") {
        buffEdit[i].ability.name = "Faerie Fire";}*/
      if (buffEdit[i].type == "removebuff" && buffEdit[i].timestamp == buffEdit[i-1].timestamp && buffEdit[i-1].type == "applybuff") {
        for (j=i; j<=i+10; j++) {
          if (j<buffEdit.length)
            if (buffEdit[j].timestamp == buffEdit[i-1].timestamp)
              buffEdit[j].timestamp = buffEdit[j].timestamp + 1;
        }
      }
    }
  }

  var timestampList = new Array;
  for (var i=0; i<buffEdit.length; i++) {
    timestampList[i] = buffEdit[i].timestamp;
  }
  
  var uniqueStamps = timestampList.filter(onlyUnique);
  var currentBoss = "None";
  var currentStart = 0;
  var idx = 0;
  var timeAt = 0;
  var output = new Array;
  var rb = "</td><td>" + "&nbsp removed by &nbsp" + "</td>";
  var tdtr = "</td></tr>";
  var buffOne = "";
  var buffTwo = "";
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
    
    buffOne = classColor(idx,"right");
    buffTwo = classColor(idx+1,"left");
    
    timeAt = "<tr><td style='text-align:right'>" + formatNumber((buffEdit[idx].timestamp-currentStart)/1000) + ":</td>"; //<td style='text-align:right'>
    if (count==2) {
      if (buffEdit[idx].type == "removebuff" && buffEdit[idx+1].type == "applybuff") {
        if (buffEdit[idx].ability.name!==buffEdit[idx+1].ability.name)
          if (buffEdit[idx].targetID == buffEdit[idx+1].targetID)
            output += (timeAt + buffOne + rb + buffTwo + tdtr);
      }
      else
        console.log(timeAt + ": Error, " + buffEdit[idx].type + " " + buffEdit[idx+1].type) 
    }
    
    else if (count==3) {
      if (buffEdit[idx].type == "removebuff" && buffEdit[idx+1].type == "removebuff" && buffEdit[idx+2].type == "applybuff") {
        if (buffEdit[idx].ability.name == buffEdit[idx+2].ability.name)
          output += (timeAt + classColor(idx+1,"right") + rb + "<td style='text-align:left'>Phantom Buff (" + buffEdit[idx+2].ability.name + ")" + tdtr);
        else if (buffEdit[idx+1].ability.name == buffEdit[idx+2].ability.name)
          output += (timeAt + buffOne + rb + "<td style='text-align:left'>Phantom Buff (" + buffEdit[idx+2].ability.name + ")" + tdtr);
        else if (buffEdit[idx+1].ability.name == "Hammer of Justice" && buffEdit[idx+2].ability.name == "Kidney Shot")
          output += (timeAt + buffOne + rb + "<td style='text-align:left'>Phantom Buff (" + buffEdit[idx+1].ability.name + "/" + buffEdit[idx+2].ability.name + ")" + tdtr);
        else if (buffEdit[idx+1].ability.name == "Kidney Shot" && buffEdit[idx+2].ability.name == "Hammer of Justice")
          output += (timeAt + buffOne + rb + "<td style='text-align:left'>Phantom Buff (" + buffEdit[idx+1].ability.name + "/" + buffEdit[idx+2].ability.name + ")" + tdtr);
        else if (buffEdit[idx+1].ability.name == "Sunder Armor" && buffEdit[idx+2].ability.name == "Expose Armor")
          output += (timeAt + buffOne + rb + "<td style='text-align:left'>Phantom Buff (" + buffEdit[idx+1].ability.name + "/" + buffEdit[idx+2].ability.name + ")" + tdtr);
        else if (buffEdit[idx].ability.name == "Sunder Armor" && buffEdit[idx+2].ability.name == "Expose Armor")
          output += (timeAt + classColor(idx+1,"right") + rb + "<td style='text-align:left'>Phantom Buff (" + buffEdit[idx].ability.name + "/" + buffEdit[idx+2].ability.name + ")" + tdtr);
        else
          output += (timeAt + buffOne + " and " + buffEdit[idx+1].ability.name + rb + "<td style='text-align:left'>" + buffEdit[idx+2].ability.name + tdtr);
      }
      else if (buffEdit[idx].type == "removebuff" && buffEdit[idx+1].type == "applybuff" && buffEdit[idx+2].type == "applybuff") {
        if (buffEdit[idx].ability.name !== buffEdit[idx+1].ability.name && buffEdit[idx].ability.name !== buffEdit[idx+2].ability.name)
          if (buffEdit[idx].ability.name !== "Sunder Armor")
            output += (timeAt + buffOne + rb + "<td style='text-align:left'>" + buffEdit[idx+1].ability.name + " or " + buffEdit[idx+2].ability.name + tdtr);
      }
      else 
        console.log(timeAt + ": Error, " + buffEdit[idx].type + " " + buffEdit[idx+1].type + " " + buffEdit[idx+2].type)
    }
    
    else if (count==4) {
      if (buffEdit[idx].type == "removebuff" && buffEdit[idx+1].type == "applybuff" && buffEdit[idx+2].type == "applybuff" && buffEdit[idx+3].type == "applybuff") {
        if (buffEdit[idx].ability.name !== buffEdit[idx+1].ability.name && buffEdit[idx].ability.name !== buffEdit[idx+2].ability.name && buffEdit[idx].ability.name !== buffEdit[idx+3].ability.name)
          output += (timeAt + buffOne + rb + "<td style='text-align:left'>" + buffEdit[idx+1].ability.name + " or " + buffEdit[idx+2].ability.name + " or " + buffEdit[idx+3].ability.name + tdtr)
      }
      else if (buffEdit[idx].type == "removebuff" && buffEdit[idx+1].type == "removebuff" && buffEdit[idx+2].type == "applybuff" && buffEdit[idx+3].type == "applybuff") {
        console.log(timeAt + ": " + buffEdit[idx].ability.name + " & " + buffEdit[idx+1].ability.name + " removed by " + buffEdit[idx+2].ability.name + " & " + buffEdit[idx+3].ability.name)
      }
      else 
        console.log(timeAt + ": Error, " + buffEdit[idx].type + " " + buffEdit[idx+1].type + " " + buffEdit[idx+2].type + " " + buffEdit[idx+3].type)
    }
    
    else if (count==5) {
      if (buffEdit[idx].type == "removebuff" && buffEdit[idx+1].type == "applybuff" && buffEdit[idx+2].type == "applybuff" && buffEdit[idx+3].type == "applybuff" && buffEdit[idx+4].type == "applybuff") {
        if (buffEdit[idx].ability.name !== buffEdit[idx+1].ability.name && buffEdit[idx].ability.name !== buffEdit[idx+2].ability.name && buffEdit[idx].ability.name !== buffEdit[idx+3].ability.name && buffEdit[idx].ability.name !== buffEdit[idx+4].ability.name)
          output += (timeAt + buffOne + rb + "<td style='text-align:left'>" + buffEdit[idx+1].ability.name + " or " + buffEdit[idx+2].ability.name + " or " + buffEdit[idx+3].ability.name + " or " + buffEdit[idx+4].ability.name + tdtr)
      }
      else 
        console.log(timeAt + ": Error, " + buffEdit[idx].type + " " + buffEdit[idx+1].type + " " + buffEdit[idx+2].type + " " + buffEdit[idx+3].type + " " + buffEdit[idx+4].type)
    }
    
    else
       console.log(timeAt + ": Error, " + count)
  }
  document.getElementById("page4").innerHTML = output + "<tr> <td><div style='width: 70px'></div></td> <td><div style='width: 180px'></div></td> <td><div style='width: 100px'></div></td> <td><div style='width: 250px'></div></td> </tr></table>";
  console.log(bossNames)
  console.log(bossStarts)
  console.log(bossEnds)
  console.log(uniqueStamps)
  console.log(timestampList)
  console.log(fightData)
  console.log(buffEdit)
  
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
      var cellString = "<td style=" + colorName + ">" + who.name + "'s " + buffEdit[idx].ability.name;
    else if (pet == true)
      var cellString = "<td style=" + colorName + ">" + who.name + "'s Pet's " + buffEdit[idx].ability.name;
    
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
