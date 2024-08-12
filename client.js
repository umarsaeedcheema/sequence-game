"use strict";


const ws = new WebSocket(`ws://localhost:8080`);

// binanceWS.on("open", function open() {
//   console.log("open action");
// });
// ws.on("open", function open() {
//   console.log("open action");
// });
// ws.on("message", function incoming(data) {
//   console.log(data);});




const Sequence = () => {
  const [board, setBoard] = React.useState([[]]);
  const [positionBoard, setPositionBoard] = React.useState([[]]);
  const [cards, setCards] = React.useState([]);
  const [msg,Setmsg] = React.useState('waiting for players to connect');
  const [playerId,SetPlayerId] = React.useState(null);
  const [teamColor,setTeamColor] = React.useState('green');
  const [playerTurn,setPlayerTurn] = React.useState(null);
  const [draw,setDraw] = React.useState(false);
  
  
  ws.onopen = function() {
    console.log("ok")
  };
  ws.onmessage = function incoming(msgFromServer) {
    let msgbody = msgFromServer.data;
    if (!!msgbody)
    {
     let parsedBody = JSON.parse(msgbody)
     console.log(parsedBody);
      if(!!parsedBody.type && parsedBody.type==='newboard')
      {
        setPositionBoard(parsedBody.positionBoard);
        setBoard(parsedBody.board);
        setCards(parsedBody.deck);
        setTeamColor(parsedBody.teamColor);
        SetPlayerId(parsedBody.player);
        setPlayerTurn(parsedBody.playerIdToplay+1)
        if(parsedBody.player===parsedBody.playerIdToplay+1)
        {
          Setmsg('Your turn');
        }
        else
        {

          Setmsg(`Player ${parsedBody.playerIdToplay+1}'s Trun`);
        }
        
      }
      if(!!parsedBody.type && parsedBody.type==="update")
      {
        setPositionBoard(parsedBody.positionBoard);
        setPlayerTurn(parsedBody.playerIdToplay+1);
        if(!!parsedBody.deck)
        {
          setCards(parsedBody.deck);
        }
        if(playerId===parsedBody.playerIdToplay+1)
        {
          Setmsg('Your turn');
        }
        else
        {

          Setmsg(`Player ${parsedBody.playerIdToplay+1}'s Trun`);
        }
      }
      if(!!parsedBody.type && parsedBody.type==='draw')
      {
        Setmsg(parsedBody.message);
        setPositionBoard(parsedBody.positionBoard);
        setDraw(true);
      }
      if(!!parsedBody.type && parsedBody.type==='won')
      {
        console.log(parsedBody)
        Setmsg(`${parsedBody.TeamWon} team won`);
        setDraw(true);
        setPositionBoard(parsedBody.positionBoard);
      }
    }
  }
  console.log(board);
  let diamondSign = "♦";
  let heartSign = "♥";
  let spadesSign = "♠";
  let clubsSign = "♣";
  function getCardRank (cardClass)
  {
    console.log(cardClass);
    let obj=cardClass.split(" ");
    let rank = obj[1].split("-")[1];
    return rank

  }
  console.log(cards);
  function getSuit(cardClass)
  {
    let  suit=cardClass.split(" ")[2];
    if(suit=="spades")
    {
      return spadesSign;
    }
    else if(suit=="diams")
    {
      return diamondSign;
    }
    else if(suit=="clubs")
    {
      return clubsSign;
    }
    else
    {
      return heartSign;
    } 
  }
  function sentCard(colIndex,rowIndex)
  {
    /* sent card details to the server */
    if(draw)
    {
      return;
    }
    console.log(playerId);
    console.log(playerTurn);
    if(playerTurn===playerId)
    {

      let previousLen = cards.length
      let cardSelected = board[colIndex][rowIndex];
      let index = cards.indexOf(cardSelected)
      //let splitCard = cardSelected.split(" ");
      //let rank = splitCard[1].split("-")[1];
      let newCards = cards.filter((card,i)=>
      {
        return index!==i
  
      });
      let jackCard = "";
      let checkjack= false;
      for (let card of cards)
      {
        let splitCard = card.split(" ")
        let rank = splitCard[1].split("-")[1];
        if(rank==='j')
         {
           checkjack = true;
           jackCard = card;
           break;
         }
      }
      setCards(newCards);
      console.log(previousLen)
      if(newCards.length===previousLen-1)
      {
        ws.send(JSON.stringify(
          {
              type:"move made",
              column: colIndex,
              row: rowIndex,
              teamcolor:teamColor
          }));
      }
      else if(checkjack)
      {
        let newCards = cards.filter((card,i)=>
        {
          return card!==jackCard
  
         });
         setCards(newCards);
        ws.send(JSON.stringify(
          {
              type:"move made",
              column: colIndex,
              row: rowIndex,
              teamcolor:teamColor
          }));

      }
      else
      {
        Setmsg("Invalid Move: Try Again");
      }
    }
    else
    {
      Setmsg(`Wait for player ${playerTurn} to complete their turn`);
    }
    
  }
  function boradStatus(i,j)
  {
    if(positionBoard.length===1)
    {
      return false
    }
    else
    {
      return positionBoard[i][j] !== '-';
    }
  }
  console.log(positionBoard);

  // ws.current.onmessage = (ev) => {
  //   const message = JSON.parse(ev.data);
  //   console.log(message);
  // };
  // ws.close()

  return (
    <div>
      <div className="container">{board.map((col,colIndex)=>
        (
          <div>
          <div class="playingCards fourColours rotateHand">
          <ul className="table">
           {col.map((cardClass,rowIndex)=>
           (
            <div>
            <li>
                {boradStatus(colIndex,rowIndex)?<div className="card"><div className={positionBoard[colIndex][rowIndex]==='g'?'green':'blue'}></div></div>: cardClass!=="card back" ? <div className={cardClass} onClick={()=>(sentCard(colIndex,rowIndex))}> <span className="rank">{getCardRank(cardClass)}</span> 
                <span className="suit">{getSuit(cardClass)}</span></div> : <div className={cardClass} onClick={()=>(sentCard(colIndex,rowIndex))}> <span className="rank"></span> </div> 
                
              }
            </li>
          </div>
           ))}
          </ul>
          </div>
          </div>

        ))}
      </div>
      <div className="container">
        <div>
          <h1>Your Cards:</h1>
        </div>
        <div class="playingCards fourColours rotateHand">
        <ul class="table">
                {cards.map(card=>
                (
                    <li>
                {card!=="card back" ? <a className={card}> <span className="rank">{getCardRank(card)}</span> 
                <span className="suit">{getSuit(card)}</span></a> : <a className={card}> <span className="rank"></span> </a> 
                }
                    </li>
                ))
                }
        </ul>
        </div>
        <div className="text_box">{msg}</div>
        <div className={`color ${teamColor}`}> </div>
        
        {/* code for circle representing the players team color comes here */}
      </div>
    </div>
  );
};

ReactDOM.render(<Sequence />, document.querySelector(`#root`));
