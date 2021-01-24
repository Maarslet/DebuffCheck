function checkDebuffsUsed() {
  
  document.getElementsByClassName("loader")[1].style.display = "none";
  
  var input = document.querySelector("#input2").value;
  input = input.trim();
  var indx = input.indexOf("/reports/")+"/reports/".length;
  if (input.length>16)
    input = input.slice(indx,indx+16);
  else if (input.length<16) {
    document.getElementById("page2").innerHTML = "Error, invalid report ID.";
    return
  }
  
  document.getElementById("page2").innerHTML = "Code stopped for some reason";
  
  var logID = input.trim(); console.log("'" + logID + "'")
  var API = "&api_key=120a438a467e97b900a062c8a7a34000";
  var baseURL = "https://classic.warcraftlogs.com:443/v1/report";
  
  var filterAdd = "%20AND%20ability.id%20not%20in%20%2812721%2C25306%2C18809%2C10151%29%20AND%20ability.name%20not%20in%20%28%22Deep%20Wound%22%2C%22Fireball%22%2C%22Pyroblast%22";
  if (document.getElementById("thunderfury").checked == true)
    filterAdd += "%2C%22Thunderfury%22";
  if (document.getElementById("giftOfArthas").checked == true)
    filterAdd += "%2C%22Gift%20of%20Arthas%22";
  if (document.getElementById("taunt").checked == true)
    filterAdd += "%2C%22Taunt%22";
  if (document.getElementById("sunderArmor").checked == true)
    filterAdd += "%2C%22Sunder%20Armor%22";
  if (document.getElementById("demoShout").checked == true)
    filterAdd += "%2C%22Demoralizing%20Shout%22";
  if (document.getElementById("exposeArmor").checked == true)
    filterAdd += "%2C%22Expose%20Armor%22";
  if (document.getElementById("exposeWeakness").checked == true)
    filterAdd += "%2C%22Expose%20Weakness%22";
  if (document.getElementById("huntersMark").checked == true)
    filterAdd += "%2C%22Hunter%27s%20Mark%22";
  if (document.getElementById("screech").checked == true)
    filterAdd += "%2C%22Screech%22";
  if (document.getElementById("fireVul").checked == true)
    filterAdd += "%2C%22Fire%20Vulnerability%22";
  if (document.getElementById("ignite").checked == true)
    filterAdd += "%2C%22Ignite%22";
  if (document.getElementById("shadowVulWarlock").checked == true)
    filterAdd += "%2C%22Shadow%20Vulnerability%22";
  if (document.getElementById("curseReck").checked == true)
    filterAdd += "%2C%22Curse%20of%20Recklessness%22";
  if (document.getElementById("curseElements").checked == true)
    filterAdd += "%2C%22Curse%20of%20the%20Elements%22";
  if (document.getElementById("curseShadow").checked == true)
    filterAdd += "%2C%22Curse%20of%20Shadow%22";
  if (document.getElementById("corruption").checked == true)
    filterAdd += "%2C%22Corruption%22";
  if (document.getElementById("faerieFire").checked == true)
    filterAdd += "%2C%22Faerie%20Fire%22";
  if (document.getElementById("faerieFireFeral").checked == true)
    filterAdd += "%2C%22Faerie%20Fire%20%28Feral%29%22";
  if (document.getElementById("mindFlay").checked == true)
    filterAdd += "%2C%22Mind%20Flay%22";
  if (document.getElementById("shadowWordPain").checked == true)
    filterAdd += "%2C%22Shadow%20Word%3A%20Pain%22";
  filterAdd += "%29";
  
  //encounterID!=0 AND type in ("applydebuff") AND ability.name not in ("Deep Wound","Fireball","Pyroblast") AND target.id in (12118,11982,12259,12057,12056,12264,12098,11988,11502,10184,12435,13020,12017,11983,14601,11981,14020,11583,14507,14517,14510,11382,15082,14509,15114,14515,11380,14834,15348,15341,15340,15370,15369,15339,15263,15543,15511,15544,15516,15510,15299,15509,15276,15517,15589,15727,15956,15953,15952,15954,15936,16011,16061,16060,16064,16065,16062,16063,16028,15931,15932,15928,15989,15990)
  //var filter="&filter=encounterID%21%3D0%20AND%20type%20in%20%28%22applydebuff%22%29%20AND%20ability.name%20not%20in%20%28%22Deep%20Wound%22%2C%22Fireball%22%2C%22Pyroblast%22%29%20AND%20target.id%20in%20%2812118%2C11982%2C12259%2C12057%2C12056%2C12264%2C12098%2C11988%2C11502%2C10184%2C12435%2C13020%2C12017%2C11983%2C14601%2C11981%2C14020%2C11583%2C14507%2C14517%2C14510%2C11382%2C15082%2C14509%2C15114%2C14515%2C11380%2C14834%2C15348%2C15341%2C15340%2C15370%2C15369%2C15339%2C15263%2C15543%2C15511%2C15544%2C15516%2C15510%2C15299%2C15509%2C15276%2C15517%2C15589%2C15727%29";
  var filter = "&filter=encounterID%21%3D0%20AND%20type%20in%20%28%22applydebuff%22%29%20AND%20target.id%20in%20%2812118%2C11982%2C12259%2C12057%2C12056%2C12264%2C12098%2C11988%2C11502%2C10184%2C12435%2C13020%2C12017%2C11983%2C14601%2C11981%2C14020%2C11583%2C14507%2C14517%2C14510%2C11382%2C15082%2C14509%2C15114%2C14515%2C11380%2C14834%2C15348%2C15341%2C15340%2C15370%2C15369%2C15339%2C15263%2C15543%2C15511%2C15544%2C15516%2C15510%2C15299%2C15509%2C15276%2C15517%2C15589%2C15727%2C15956%2C15953%2C15952%2C15954%2C15936%2C16011%2C16061%2C16060%2C16064%2C16065%2C16062%2C16063%2C16028%2C15931%2C15932%2C15928%2C15989%2C15990%29" + filterAdd;
  try {
    var fightData = new XMLHttpRequest();
    fightData.open("Get", baseURL + "/fights/" + logID + "?" + API.slice(1,API.length), false);
    fightData.send(null);
    fightData = JSON.parse(fightData.response);
    var debuffData = new XMLHttpRequest();
    debuffData.open("Get", baseURL + "/events/debuffs/" + logID + "?start=0&end=1000000000&hostility=1&wipes=2" + filter + API, false);
    debuffData.send(null);
    debuffData = JSON.parse(debuffData.response);
  
    var nextTime = debuffData.nextPageTimestamp;
    while (nextTime>1) {
      var dataadd = new XMLHttpRequest();
      dataadd.open("Get", baseURL + "/events/debuffs/" + logID + "?start=" + nextTime + "&end=1000000000&hostility=1&wipes=2" + filter + API, false);
      dataadd.send(null);
      dataadd = JSON.parse(dataadd.response);
      debuffData.events = debuffData.events.concat(dataadd.events);
      nextTime = dataadd.nextPageTimestamp;
    }
  }
  catch(err) {
    document.getElementById("page2").innerHTML = "Error: " + err.message; 
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
  console.log(debuffEdit)
  
  var currentBoss = "None";
  var currentStart = 0;
  var timeAt = new String;
  var output = new Array;
  var ab = "</td><td>" + "&nbsp applied by &nbsp" + "</td>";
  var tdtr = "</td></tr>";
  output[0] = "<table><tr><th colspan='4' style='text-align:left'>" + "Report ID: " + logID + "</th></tr>";
  
  for (var i=0; i<debuffEdit.length; i++) {
    for (var j=0; j<bossNames.length; j++) {
      if (debuffEdit[i].timestamp>bossStarts[j] && debuffEdit[i].timestamp<bossEnds[j] && bossNames[j]!==currentBoss) {
        currentBoss = bossNames[j];
        currentStart = bossStarts[j];
        if (i!==0) 
          output += ("<tr><th colspan='4'></th></tr>")
        output += ("<tr><th colspan='4'>" + currentBoss + " (" + Math.round((bossEnds[j]-bossStarts[j])/1000) + "s fight)" + "</th></tr>")
        //console.log(" ")
        //console.log("--- " + currentBoss + ", with a duration of " + (bossEnds[j]-bossStarts[j])/1000 + " seconds ---")
      }
    }
    
    timeAt = "<tr><td style='text-align:right'>" + formatNumber((debuffEdit[i].timestamp-currentStart)/1000) + ":</td>";
    
    try {
      var who = fightData.friendlies[friendIDs.indexOf(debuffEdit[i].sourceID)];
      var pet = false;
      var spec = who.type;
    }
    catch {
      // Handle mc'd enemy that applies a debuff like Naxxramas Worshipper at Faerlina
      if (!fightData.friendlyPets[petIDs.indexOf(debuffEdit[i].sourceID)]) {
        var who = {name: fightData.enemies[enemyIDs.indexOf(debuffEdit[i].sourceID)].name};
        var pet = false;
        var spec = "Enemy";
      }
      else {
        var who = fightData.friendlies[friendIDs.indexOf(fightData.friendlyPets[petIDs.indexOf(debuffEdit[i].sourceID)].petOwner)];
        var pet = true;
        var spec = who.type;
      }
    }
    
    var preString = ";color:"
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
    else if (spec == "Enemy")
      var colorName = preString + "#8b0000";
    
    if (pet == false)
      var name = who.name;
    else
      var name = who.name + "'s Pet";
    
    output += (timeAt + "<td style=text-align:right" + colorName + ">" + debuffEdit[i].ability.name + ab + "<td style=text-align:left" + colorName + ">" + name + tdtr);
    
  }
  document.getElementById("page2").innerHTML = output + "<tr> <td><div style='width: 70px'></div></td> <td><div style='width: 180px'></div></td> <td><div style='width: 100px'></div></td> <td><div style='width: 250px'></div></td> </tr></table>";
  
  console.log(bossNames)
  console.log(bossStarts)
  console.log(bossEnds)
}
