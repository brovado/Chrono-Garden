const STORAGE_KEY = "chrono-garden-save-v2";

const PLANTS = {
  rose: {
    name:"Rose", icon:"🌹",
    stages:[{at:0,name:"Seed",icon:"🌱"},{at:4,name:"Sprout",icon:"🌱"},{at:12,name:"Young Rose",icon:"🌹"},{at:24,name:"Rose",icon:"🌹"}],
    mutations:[{name:"Golden Rose",icon:"🌼",at:30},{name:"Thorny Rose",icon:"🥀",at:42},{name:"Crystal Rose",icon:"💎",at:60}]
  },
  sunflower: {
    name:"Sunflower", icon:"🌻",
    stages:[{at:0,name:"Seed",icon:"🌱"},{at:5,name:"Sprout",icon:"🌱"},{at:14,name:"Young Sunflower",icon:"🌻"},{at:26,name:"Sunflower",icon:"🌻"}],
    mutations:[{name:"Golden Sunflower",icon:"✨",at:34},{name:"Radiant Sunflower",icon:"☀️",at:52},{name:"Celestial Sunflower",icon:"🌞",at:72}]
  },
  mushroom: {
    name:"Mushroom", icon:"🍄",
    stages:[{at:0,name:"Spore",icon:"🌱"},{at:6,name:"Sprout",icon:"🌱"},{at:16,name:"Young Mushroom",icon:"🍄"},{at:28,name:"Mushroom",icon:"🍄"}],
    mutations:[{name:"Glowing Mushroom",icon:"💡",at:36},{name:"Crystal Mushroom",icon:"💎",at:55},{name:"Ancient Mushroom",icon:"🪨",at:76}]
  }
};
const starterChoices=Object.keys(PLANTS);

function defaultState(){
  return {
    gardenTime:24,tickets:100,gold:500,match3Unlocked:false,nextPlantId:4,
    plots:[makePlant("rose",0),makePlant("sunflower",0),makePlant("mushroom",0),null,null,null],
    discoveries:{rose:["Rose"],sunflower:["Sunflower"],mushroom:["Mushroom"]}
  };
}
function makePlant(type,plantedAt){
  return {id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),type,plantedAt,mutationIndex:-1,lastMutationAt:null};
}
let state=loadState();
const gardenEl=document.getElementById("garden");
const timeEl=document.getElementById("garden-time");
const ticketsEl=document.getElementById("tickets");
const goldEl=document.getElementById("gold");
const almanacEl=document.getElementById("almanac");
const statusEl=document.getElementById("garden-status");
const toastContainer=document.getElementById("toast-container");
const screenTitle=document.getElementById("screen-title");

function loadState(){
  try{const saved=localStorage.getItem(STORAGE_KEY);if(saved){const parsed=JSON.parse(saved);return {...defaultState(),...parsed};}}
  catch(error){console.warn("Save could not be loaded.",error);}
  return defaultState();
}
function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
function formatGardenTime(hours){
  const totalMinutes=Math.floor(hours*60),days=Math.floor(totalMinutes/1440),remaining=totalMinutes%1440;
  const hh=String(Math.floor(remaining/60)).padStart(2,"0"),mm=String(remaining%60).padStart(2,"0");
  return `Day ${days+1} · ${hh}:${mm}`;
}
function getPlantAge(plant){return Math.max(0,state.gardenTime-plant.plantedAt);}
function getPlantVariant(plant){
  const data=PLANTS[plant.type];
  if(plant.mutationIndex>=0)return data.mutations[plant.mutationIndex];
  let stage=data.stages[0];
  for(const candidate of data.stages)if(getPlantAge(plant)>=candidate.at)stage=candidate;
  return stage;
}
function render(){
  timeEl.textContent=formatGardenTime(state.gardenTime);
  ticketsEl.textContent=Math.floor(state.tickets).toLocaleString();
  goldEl.textContent=Math.floor(state.gold).toLocaleString();
  const occupied=state.plots.filter(Boolean).length;
  statusEl.textContent=`${occupied}/${state.plots.length} plots`;
  gardenEl.innerHTML="";
  state.plots.forEach((plant,index)=>{
    const plot=document.createElement("div");plot.className=plant?"plot":"plot empty";
    if(!plant){
      plot.innerHTML=`<div><div>Empty plot</div><button data-plant-plot="${index}">Plant something</button></div>`;
      gardenEl.appendChild(plot);return;
    }
    const data=PLANTS[plant.type],variant=getPlantVariant(plant),age=getPlantAge(plant);
    const matureAt=data.stages[data.stages.length-1].at,progress=Math.min(100,(age/matureAt)*100);
    const mutation=plant.mutationIndex>=0?`<span class="mutation">Mutation discovered</span>`:"";
    plot.innerHTML=`<div><span class="eyebrow">PLOT ${index+1}</span><div class="plant-icon">${variant.icon}</div><div class="plant-name">${variant.name}</div><div class="plant-age">Age: ${formatAge(age)}</div>${mutation}</div><div><div class="growth"><span style="width:${progress}%"></span></div></div>`;
    gardenEl.appendChild(plot);
  });
  renderAlmanac();updateMatch3Card();saveState();
}
function formatAge(hours){
  if(hours<1)return "just planted";
  if(hours<24)return `${Math.floor(hours)}h`;
  const days=Math.floor(hours/24),remainder=Math.floor(hours%24);
  return `${days}d ${remainder}h`;
}
function renderAlmanac(){
  almanacEl.innerHTML="";
  Object.entries(PLANTS).forEach(([key,data])=>{
    const discoveries=state.discoveries[key]||[],row=document.createElement("div");row.className="almanac-row";
    row.innerHTML=`<span>${data.name}</span><span>${discoveries.length}/${data.mutations.length+1} found</span>`;
    almanacEl.appendChild(row);
  });
}
function advanceTime(hours){
  state.gardenTime+=hours;checkMutations();render();toast(`The garden advanced ${formatAge(hours)}.`);
}
function checkMutations(){
  state.plots.forEach(plant=>{
    if(!plant)return;
    const data=PLANTS[plant.type],age=getPlantAge(plant),nextIndex=plant.mutationIndex+1,nextMutation=data.mutations[nextIndex];
    if(!nextMutation||age<nextMutation.at)return;
    plant.mutationIndex=nextIndex;plant.lastMutationAt=state.gardenTime;
    if(!state.discoveries[plant.type])state.discoveries[plant.type]=[data.name];
    if(!state.discoveries[plant.type].includes(nextMutation.name))state.discoveries[plant.type].push(nextMutation.name);
    toast(`✨ Your ${data.name} became a ${nextMutation.name}!`);
  });
}
function plantInPlot(index,type){
  if(state.plots[index])return;
  state.plots[index]=makePlant(type,state.gardenTime);render();toast(`${PLANTS[type].name} planted. Now we wait.`);
}
gardenEl.addEventListener("click",event=>{
  const button=event.target.closest("[data-plant-plot]");if(!button)return;
  const index=Number(button.dataset.plantPlot);plantInPlot(index,starterChoices[index%starterChoices.length]);
});
document.querySelectorAll("[data-deposit]").forEach(button=>{
  button.addEventListener("click",()=>{
    const cost=Number(button.dataset.deposit),hours=cost===10?1:cost===50?6:24;
    if(state.tickets<cost){toast("Not enough Tickets.",true);return;}
    state.tickets-=cost;advanceTime(hours);
  });
});

function toast(message,error=false){
  const item=document.createElement("div");item.className="toast";if(error)item.style.borderColor="#8f5147";
  item.textContent=message;toastContainer.appendChild(item);setTimeout(()=>item.remove(),3000);
}

/* --- Screen navigation --- */
function showMainScreen(screenId){
  document.querySelectorAll(".screen").forEach(screen=>{
    screen.hidden=screen.id!==screenId;
    screen.classList.toggle("active",screen.id===screenId);
  });
  document.querySelectorAll(".nav-button").forEach(nav=>{
    const isActive=nav.dataset.screen===screenId;
    nav.classList.toggle("active",isActive);
    nav.setAttribute("aria-current",isActive?"page":"false");
  });
  screenTitle.textContent=screenId==="garden-screen"?"The Garden":"Mini Games";
  window.scrollTo({top:0,behavior:"smooth"});
}

document.querySelectorAll("[data-screen]").forEach(button=>{
  button.addEventListener("click",()=>{
    closeMiniGame();
    showMainScreen(button.dataset.screen);
  });
});

/* --- Mini-game selection --- */
const activeMiniGame=document.getElementById("active-mini-game");
const miniGameSelection=document.querySelector(".mini-game-selection");
const activeGameTitle=document.getElementById("active-game-title");
const activeGameEyebrow=document.getElementById("active-game-eyebrow");
const memoryGame=document.getElementById("memory-game");
const reactionGame=document.getElementById("reaction-game");
const match3Game=document.getElementById("match3-game");
const miniGameResult=document.getElementById("mini-game-result");
const resultTitle=document.getElementById("result-title");
const resultMessage=document.getElementById("result-message");
const resultTickets=document.getElementById("result-tickets");
let miniGameSession=0;
let resultReturnTimer=null;

document.querySelectorAll(".game-select").forEach(button=>{
  button.addEventListener("click",()=>openMiniGame(button.dataset.game));
});
const closeMiniGameButton=document.getElementById("close-mini-game");
if(closeMiniGameButton)closeMiniGameButton.addEventListener("click",closeMiniGame);

function openMiniGame(game){
  miniGameSession++;
  if(resultReturnTimer)clearTimeout(resultReturnTimer);
  resultReturnTimer=null;
  activeMiniGame.hidden=false;
  miniGameSelection.hidden=true;
  miniGameResult.hidden=true;
  memoryGame.hidden=game!=="memory";
  reactionGame.hidden=game!=="reaction";
  match3Game.hidden=game!=="match3";
  activeGameTitle.textContent=game==="memory"?"Memory Flip":game==="reaction"?"Whack-a-Mole":"Match-3 Puzzle";
  activeGameEyebrow.textContent=game==="match3"?"GOLD UNLOCK":"AVAILABLE";
  if(game==="memory")startMemoryGame();
  if(game==="reaction")resetReactionGame();
  if(game==="match3")startMatch3Game();
  activeMiniGame.scrollIntoView({behavior:"smooth",block:"start"});
}
function closeMiniGame(){
  miniGameSession++;
  if(resultReturnTimer)clearTimeout(resultReturnTimer);
  resultReturnTimer=null;
  activeMiniGame.hidden=true;
  miniGameSelection.hidden=false;
  miniGameResult.hidden=true;
  memoryGame.hidden=true;
  reactionGame.hidden=true;
  match3Game.hidden=true;
  stopReactionGame();stopMatch3Game();stopMemoryGame();
}
function showGameResult(title,message,earned){
  const session=miniGameSession;
  stopReactionGame();stopMatch3Game();stopMemoryGame();
  memoryGame.hidden=true;reactionGame.hidden=true;match3Game.hidden=true;
  resultTitle.textContent=title;
  resultMessage.textContent=message;
  resultTickets.textContent=earned;
  miniGameResult.hidden=false;
  resultReturnTimer=setTimeout(()=>{
    if(session!==miniGameSession)return;
    closeMiniGame();
  },2200);
}
function stopMemoryGame(){if(memoryTimer)clearTimeout(memoryTimer);memoryTimer=null;memoryLocked=true;memoryFirst=null;}

/* --- Memory Flip --- */
const memorySymbols=["🌹","🌻","🍄","💎"];
let memoryCards=[],memoryFlips=0,memoryMatches=0,memoryFirst=null,memoryLocked=false,memoryStartedAt=0,memoryTimer=null;
function startMemoryGame(){
  const deck=[...memorySymbols,...memorySymbols].sort(()=>Math.random()-.5);
  memoryCards=deck.map((symbol,index)=>({symbol,index,flipped:false,matched:false}));
  if(memoryTimer)clearTimeout(memoryTimer);
  memoryFlips=0;memoryMatches=0;memoryFirst=null;memoryLocked=false;memoryStartedAt=Date.now();
  renderMemory();
}
function renderMemory(){
  memoryGame.innerHTML="";
  memoryCards.forEach(card=>{
    const button=document.createElement("button");button.className="memory-card";
    if(card.flipped||card.matched){button.classList.add(card.matched?"matched":"flipped");button.textContent=card.symbol;}else button.textContent="❔";
    button.addEventListener("click",()=>flipMemory(card.index));memoryGame.appendChild(button);
  });
  const hud=document.createElement("div");hud.className="memory-hud";hud.style.gridColumn="1 / -1";hud.textContent=`Flips: ${memoryFlips} · Matches: ${memoryMatches}/4`;
  memoryGame.appendChild(hud);
}
function flipMemory(index){
  if(memoryLocked)return;
  const card=memoryCards[index];if(card.flipped||card.matched)return;
  card.flipped=true;memoryFlips++;renderMemory();
  if(!memoryFirst){memoryFirst=card;return;}
  memoryLocked=true;
  const first=memoryFirst;memoryFirst=null;
  if(first.symbol===card.symbol){
    memoryTimer=setTimeout(()=>{memoryTimer=null;first.matched=true;card.matched=true;memoryMatches++;memoryLocked=false;renderMemory();if(memoryMatches===4)endMemoryGame();},350);
  }else{
    memoryTimer=setTimeout(()=>{memoryTimer=null;first.flipped=false;card.flipped=false;memoryLocked=false;renderMemory();},650);
  }
}
function endMemoryGame(){
  const seconds=Math.max(1,Math.floor((Date.now()-memoryStartedAt)/1000));
  const bonus=Math.max(0,30-memoryFlips*2-Math.floor(seconds/5));
  const earned=10+bonus;state.tickets+=earned;saveState();render();
  showGameResult("Memory complete!","You found every pair.",earned);
}

/* --- Whack-a-Mole --- */
const reactionAction=document.getElementById("reaction-action");
const reactionStatus=document.getElementById("reaction-status");
const reactionRound=document.getElementById("reaction-round");
const reactionBest=document.getElementById("reaction-best");
const moleBoard=document.getElementById("mole-board");
let reactionRoundValue=0,reactionHits=0,reactionState="idle",reactionTimer=null,moleTimer=null,moleActiveIndex=-1;

reactionAction.addEventListener("click",handleReactionClick);

function resetReactionGame(){
  stopReactionGame();
  reactionRoundValue=0;reactionHits=0;reactionState="idle";moleActiveIndex=-1;
  reactionStatus.textContent="Whack the glowing critter as soon as it appears!";
  reactionAction.textContent="START";
  reactionRound.textContent="0 / 15";
  reactionBest.textContent="0";
  renderMoleBoard();
}
function stopReactionGame(){
  if(reactionTimer)clearTimeout(reactionTimer);
  if(moleTimer)clearTimeout(moleTimer);
  reactionTimer=null;moleTimer=null;reactionState="idle";moleActiveIndex=-1;
}
function renderMoleBoard(){
  moleBoard.innerHTML="";
  for(let i=0;i<9;i++){
    const button=document.createElement("button");
    button.type="button";
    button.className="mole-hole";
    button.setAttribute("aria-label",i===moleActiveIndex?"Whack the glowing critter":"Empty garden patch");
    if(i===moleActiveIndex){
      button.classList.add("active");
      button.textContent="🐹";
    }else{
      button.textContent="🌱";
    }
    button.addEventListener("click",()=>whackMole(i));
    moleBoard.appendChild(button);
  }
}
function handleReactionClick(){
  if(reactionState==="idle"){
    if(reactionRoundValue>=15){resetReactionGame();return;}
    startMoleRound();
    return;
  }
  if(reactionState==="finished"){resetReactionGame();return;}
}
function startMoleRound(){
  reactionState="waiting";
  reactionRoundValue++;
  reactionRound.textContent=`${reactionRoundValue} / 15`;
  reactionStatus.textContent="Get ready...";
  reactionAction.textContent="WATCH";
  moleActiveIndex=-1;
  renderMoleBoard();
  const delay=350+Math.random()*800;
  reactionTimer=setTimeout(()=>{
    reactionTimer=null;
    if(reactionState!=="waiting")return;
    reactionState="ready";
    moleActiveIndex=Math.floor(Math.random()*9);
    reactionStatus.textContent="WHACK!";
    reactionAction.textContent="NEXT";
    renderMoleBoard();
    moleTimer=setTimeout(()=>{
      if(reactionState!=="ready")return;
      reactionState="idle";
      moleActiveIndex=-1;
      reactionStatus.textContent="Too slow! Press NEXT to keep going.";
      reactionAction.textContent="NEXT";
      renderMoleBoard();
    },1100);
  },delay);
}
function whackMole(index){
  if(reactionState!=="ready")return;
  if(index!==moleActiveIndex)return;
  if(moleTimer)clearTimeout(moleTimer);
  moleTimer=null;
  reactionHits++;
  reactionBest.textContent=String(reactionHits);
  reactionState="idle";
  moleActiveIndex=-1;
  if(reactionRoundValue>=15){
    endReactionGame();
    return;
  }
  reactionStatus.textContent="Nice hit! Find the next one.";
  reactionAction.textContent="NEXT";
  renderMoleBoard();
}
function endReactionGame(){
  stopReactionGame();
  const earned=8+reactionHits*2;
  state.tickets+=earned;
  saveState();render();
  reactionState="finished";
  showGameResult("Whack-a-Mole complete!",`${reactionHits} of 15 critters whacked.`,earned);
}

/* --- Match-3 --- */
const matchSymbols=["🔴","🔵","🟢","🟡","🟣","🟠"];
let matchBoard=[],matchSelected=null,matchScoreValue=0,match3Timer=null,matchResolveTimer=null,match3Remaining=60,match3Active=false;
const match3Board=document.getElementById("match3-board"),match3Time=document.getElementById("match3-time"),match3Score=document.getElementById("match3-score");
function updateMatch3Card(){
  const unlock=document.getElementById("match3-unlock"),play=document.getElementById("match3-play");
  if(state.match3Unlocked){unlock.hidden=true;play.hidden=false;}else{unlock.hidden=false;play.hidden=true;}
}
const match3UnlockButton=document.getElementById("match3-unlock");
if(match3UnlockButton)match3UnlockButton.addEventListener("click",()=>{
  if(state.match3Unlocked)return;
  if(state.gold<250){toast("Not enough Gold.",true);return;}
  state.gold-=250;state.match3Unlocked=true;saveState();updateMatch3Card();render();toast("🧩 Match-3 unlocked.");
});
const match3PlayButton=document.getElementById("match3-play");
if(match3PlayButton)match3PlayButton.addEventListener("click",()=>openMiniGame("match3"));
function makeMatchBoard(){
  const board=[];
  for(let r=0;r<6;r++){
    board[r]=[];
    for(let c=0;c<6;c++){
      let value;
      do{value=Math.floor(Math.random()*matchSymbols.length);}while((c>=2&&board[r][c-1]===value&&board[r][c-2]===value)||(r>=2&&board[r-1][c]===value&&board[r-2][c]===value));
      board[r][c]=value;
    }
  }
  return board;
}
function startMatch3Game(){
  if(!state.match3Unlocked)return;
  stopMatch3Game();matchBoard=makeMatchBoard();matchSelected=null;matchScoreValue=0;match3Remaining=60;match3Active=true;renderMatch3();
  match3Timer=setInterval(()=>{match3Remaining--;renderMatch3();if(match3Remaining<=0)endMatch3Game();},1000);
}
function stopMatch3Game(){
  if(match3Timer)clearInterval(match3Timer);
  if(matchResolveTimer)clearTimeout(matchResolveTimer);
  match3Timer=null;matchResolveTimer=null;match3Active=false;
}
function renderMatch3(){
  match3Time.textContent=match3Remaining;match3Score.textContent=matchScoreValue;match3Board.innerHTML="";
  matchBoard.forEach((row,r)=>row.forEach((value,c)=>{
    const tile=document.createElement("button");tile.className="match3-tile";if(matchSelected&&matchSelected.r===r&&matchSelected.c===c)tile.classList.add("selected");
    tile.textContent=matchSymbols[value];tile.addEventListener("click",()=>selectMatchTile(r,c));match3Board.appendChild(tile);
  }));
}
function selectMatchTile(r,c){
  if(!match3Active)return;
  if(!matchSelected){matchSelected={r,c};renderMatch3();return;}
  const prev=matchSelected;matchSelected=null;
  if(Math.abs(prev.r-r)+Math.abs(prev.c-c)!==1){matchSelected={r,c};renderMatch3();return;}
  [matchBoard[prev.r][prev.c],matchBoard[r][c]]=[matchBoard[r][c],matchBoard[prev.r][prev.c]];
  if(!findMatches().length){
    [matchBoard[prev.r][prev.c],matchBoard[r][c]]=[matchBoard[r][c],matchBoard[prev.r][prev.c]];
    renderMatch3();return;
  }
  resolveMatches();
}
function findMatches(){
  const found=new Set();
  for(let r=0;r<6;r++){
    let start=0;
    for(let c=1;c<=6;c++){
      if(c<6&&matchBoard[r][c]===matchBoard[r][start])continue;
      if(c-start>=3)for(let x=start;x<c;x++)found.add(`${r},${x}`);
      start=c;
    }
  }
  for(let c=0;c<6;c++){
    let start=0;
    for(let r=1;r<=6;r++){
      if(r<6&&matchBoard[r][c]===matchBoard[start][c])continue;
      if(r-start>=3)for(let x=start;x<r;x++)found.add(`${x},${c}`);
      start=r;
    }
  }
  return [...found].map(key=>key.split(",").map(Number));
}
function resolveMatches(){
  const matches=findMatches();if(!matches.length){renderMatch3();return;}
  matchScoreValue+=matches.length*5;
  matches.forEach(([r,c])=>matchBoard[r][c]=null);
  for(let c=0;c<6;c++){
    const remaining=matchBoard.map(row=>row[c]).filter(v=>v!==null);
    while(remaining.length<6)remaining.unshift(Math.floor(Math.random()*matchSymbols.length));
    for(let r=0;r<6;r++)matchBoard[r][c]=remaining[r];
  }
  renderMatch3();matchResolveTimer=setTimeout(()=>{matchResolveTimer=null;resolveMatches();},100);
}
function endMatch3Game(){
  if(!match3Active)return;
  stopMatch3Game();const earned=Math.max(5,Math.floor(matchScoreValue/4));state.tickets+=earned;saveState();render();
  showGameResult("Match-3 complete!","Final score: "+matchScoreValue,earned);
}
render();