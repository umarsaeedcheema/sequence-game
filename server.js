const fs = require(`fs`);
const http = require(`http`);
const { parse } = require("path");
const { json } = require("stream/consumers");
const WebSocket = require(`ws`); // npm i ws
const connectedPlayers = [];
const teamColor = ["green","blue","green","blue"]
let playerInplay = 0;
let countMoves = 0;
let shuffledDeck = []
const board = [
  [
    "card back",
    "card rank-2 spades",
    "card rank-3 spades",
    "card rank-4 spades",
    "card rank-5 spades",
    "card rank-10 diams",
    "card rank-q diams",
    "card rank-k diams",
    "card rank-a diams",
    "card back",
  ],

  [
    "card rank-6 clubs",
    "card rank-5 clubs",
    "card rank-4 clubs",
    "card rank-3 clubs",
    "card rank-2 clubs",
    "card rank-4 spades",
    "card rank-5 spades",
    "card rank-6 spades",
    "card rank-7 spades",
    "card rank-a clubs",
  ],

  [
    "card rank-7 clubs",
    "card rank-a spades",
    "card rank-2 diams",
    "card rank-3 diams",
    "card rank-4 diams",
    "card rank-k clubs",
    "card rank-q clubs",
    "card rank-10 clubs",
    "card rank-8 spades",
    "card rank-k clubs",
  ],

  [
    "card rank-8 clubs",
    "card rank-k spades",
    "card rank-6 clubs",
    "card rank-5 clubs",
    "card rank-4 clubs",
    "card rank-9 hearts",
    "card rank-8 hearts",
    "card rank-9 clubs",
    "card rank-9 spades",
    "card rank-6 spades",
  ],

  [
    "card rank-9 clubs",
    "card rank-q spades",
    "card rank-7 clubs",
    "card rank-6 hearts",
    "card rank-5 hearts",
    "card rank-2 hearts",
    "card rank-7 hearts",
    "card rank-8 clubs",
    "card rank-10 spades",
    "card rank-10 clubs",
  ],

  [
    "card rank-a spades",
    "card rank-7 hearts",
    "card rank-9 diams",
    "card rank-a hearts",
    "card rank-4 hearts",
    "card rank-3 hearts",
    "card rank-k hearts",
    "card rank-10 diams",
    "card rank-6 hearts",
    "card rank-2 diams",
  ],

  [
    "card rank-k spades",
    "card rank-8 hearts",
    "card rank-8 diams",
    "card rank-2 clubs",
    "card rank-3 clubs",
    "card rank-10 hearts",
    "card rank-q hearts",
    "card rank-q diams",
    "card rank-5 hearts",
    "card rank-3 diams",
  ],

  [
    "card rank-q spades",
    "card rank-9 hearts",
    "card rank-7 diams",
    "card rank-6 diams",
    "card rank-5 diams",
    "card rank-a clubs",
    "card rank-a diams",
    "card rank-k diams",
    "card rank-4 hearts",
    "card rank-4 diams",
  ],

  [
    "card rank-10 spades",
    "card rank-10 hearts",
    "card rank-q hearts",
    "card rank-k hearts",
    "card rank-a hearts",
    "card rank-3 spades",
    "card rank-2 spades",
    "card rank-2 hearts",
    "card rank-3 hearts",
    "card rank-5 diams",
  ],

  [
    "card back",
    "card rank-9 spades",
    "card rank-8 spades",
    "card rank-7 spades",
    "card rank-6 spades",
    "card rank-9 diams",
    "card rank-8 diams",
    "card rank-7 diams",
    "card rank-6 diams",
    "card back",
  ],
];

const positionBoard = [
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
];

const deck = [
  "card rank-a spades",
  "card rank-2 spades",
  "card rank-3 spades",
  "card rank-4 spades",
  "card rank-5 spades",
  "card rank-6 spades",
  "card rank-7 spades",
  "card rank-8 spades",
  "card rank-9 spades",
  "card rank-10 spades",
  "card rank-j spades",
  "card rank-q spades",
  "card rank-k spades",
  "card rank-a clubs",
  "card rank-2 clubs",
  "card rank-3 clubs",
  "card rank-4 clubs",
  "card rank-5 clubs",
  "card rank-6 clubs",
  "card rank-7 clubs",
  "card rank-8 clubs",
  "card rank-9 clubs",
  "card rank-10 clubs",
  "card rank-j clubs",
  "card rank-q clubs",
  "card rank-k clubs",
  "card rank-a diams",
  "card rank-2 diams",
  "card rank-3 diams",
  "card rank-4 diams",
  "card rank-5 diams",
  "card rank-6 diams",
  "card rank-7 diams",
  "card rank-8 diams",
  "card rank-9 diams",
  "card rank-10 diams",
  "card rank-j diams",
  "card rank-q diams",
  "card rank-k diams",
  "card rank-a hearts",
  "card rank-2 hearts",
  "card rank-3 hearts",
  "card rank-4 hearts",
  "card rank-5 hearts",
  "card rank-6 hearts",
  "card rank-7 hearts",
  "card rank-8 hearts",
  "card rank-9 hearts",
  "card rank-10 hearts",
  "card rank-j hearts",
  "card rank-q hearts",
  "card rank-k hearts",
];

const divideDeckIntoPieces = (deck) => {
  let shuffled = deck
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  const result = new Array(Math.ceil(shuffled.length / 6))
    .fill()
    .map((_) => shuffled.splice(0, 6));
  //console.log(result);
  return result;
};

// code to read file
const readFile = (fileName) =>
  new Promise((resolve, reject) => {
    fs.readFile(fileName, `utf-8`, (readErr, fileContents) => {
      if (readErr) {
        reject(readErr);
      } else {
        resolve(fileContents);
      }
    });
  });

// code to create a server
const server = http.createServer(async (req, resp) => {
  //console.log(`browser asked for ${req.url}`);
  if (req.url == `/mydoc`) {
    const clientHtml = await readFile(`client.html`);
    resp.end(clientHtml);
  } else if (req.url == `/myjs`) {
    const clientJs = await readFile(`client.js`);
    resp.end(clientJs);
  } else if (req.url == `/sequence.css`) {
    const sequenceCss = await readFile(`sequence.css`);
    resp.end(sequenceCss);
  } else {
    resp.end(`not found`);
  }
});


// to listen for clients
server.listen(8000);

// creating a web socket
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection',(ws)=>
{
  if(connectedPlayers.length<4)
  {
    connectedPlayers.push(ws);
    if(connectedPlayers.length===4)
    {
      let shuffleDeck = divideDeckIntoPieces(deck);
      shuffledDeck = shuffleDeck;
      for (let player in connectedPlayers)
      {
        deckToSent = shuffleDeck[player];
        request = JSON.stringify({
        "type":"newboard",
        "board":board,
        "positionBoard":positionBoard,
        "deck": deckToSent,
        "player": parseInt(player)+1,
        "teamColor": teamColor[player],
        "playerIdToplay":playerInplay

      });
        connectedPlayers[player].send(request);
      }
      
    }
    ws.on('message',(data)=>
      {
        
        console.log("server");
        let packet = JSON.parse(data);
        if(!!packet.type && packet.type==='move made')
        {
          let col = packet.column;
          let row = packet.row;
          positionBoard[col][row] = packet.teamcolor==='green' ? 'g' : 'b';
          countMoves +=1;
          let winBit = winConditon(col,row);
          console.log(winBit)
          let id = 0;
          for (let player of connectedPlayers)
          {
            if(winBit)
            {
              player.send(JSON.stringify({
                'type':'won',
                'positionBoard':positionBoard,
                'TeamWon': teamColor[playerInplay],
              }))
            }
            else if(countMoves==24)
            {
              player.send(JSON.stringify({
                'type':'update',
                'positionBoard':positionBoard,
                'playerIdToplay': (playerInplay+1)%4,
                'deck': shuffledDeck[4+id]
              }))
              id+=1;
            }
            else if(countMoves===48)
            {
              player.send(JSON.stringify({
                'type':'draw',
                'positionBoard':positionBoard,
                'message':'Game Ended with a draw'
              }));

            }
            else
            {

              player.send(JSON.stringify({
                'type':'update',
                'positionBoard':positionBoard,
                'playerIdToplay': (playerInplay+1)%4
              })) 
            }
          }
          playerInplay=(playerInplay+1)%4;
        }
    });
  }
  
});


function winConditon(col, row)
{
  let startcol = col;
  let startrow = row;
  let startdigcol = col;
  let startdigrow = row;
  let startdig2col = col;
  let startdig2row = row;
  for(let i=0;i<10;i++)
  {
      let frame = []
      let frame2 = []
      let frame3 = []
      let frame4 = []
      for(let j=0;j<5;j++)
      {
          if(startrow<0)
          {
            break;
          }
          if(startrow+j<=9)
          {
              frame.push(positionBoard[col][startrow+j])
              
          }
          else
          {
            break;
          }
      }
      for(let j=0;j<5;j++)
      {
          if(startcol<0)
          {
            break
          }
          if(startcol+j<=9)
          {
              frame2.push(positionBoard[startcol+j][row])
              
          }
          else
          {
            break;
          }
      }
      for(let j=0;j<5;j++)
      {
          if(startdigcol>9 || startdigrow<0)
          {
            break
          }
          if(startdigrow+j<=9 && startdigcol-j>=0)
          {
              frame3.push(positionBoard[startdigcol-j][startdigrow+j])
              
          }
          else
          {
            break;
          }
      }
      for(let j=0;j<5;j++)
      {
          if(startdig2col<0|| startdig2row<0)
          {
            break
          }
          if(startdig2row+j<=9 && startdig2col+j<=9)
          {
              frame4.push(positionBoard[startdig2col+j][startdig2row+j])
              
          }
          else
          {
            break;
          }
      }
      startrow-=1;
      startcol-=1;
      startdigcol+=1;
      startdigrow-=1;
      startdig2col-=1;
      startdig2row-=1;
      console.log(frame)
      console.log(frame2)
      console.log(frame3)
      console.log(frame4)
      if(frame.length===5 && new Set(frame).size===1 && frame[0]!=='-')
      {
        return true
      }
      else  if(frame2.length===5 && new Set(frame2).size===1  && frame2[0]!=='-')
      {
        return true
      }
      else  if(frame3.length===5 && new Set(frame3).size===1  && frame3[0]!=='-')
      {
        return true
      }
      else  if(frame4.length===5 && new Set(frame4).size===1  && frame4[0]!=='-')
      {
        return true
      }
     
  }
  return false;
  
}