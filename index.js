const express = require('express')
const app = express()
let port = process.env.PORT || 3900;
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};
let winners = []
let userObj = {}
let dealerTotal = 0;
let d_first;
let cards = [1,2,3,4,5,6,7,8,9,10, 10, 10, 10];
let players = {};
let playerCount = 0;
let bustedArray = [];
let standArray = [];
let standIndexArray = [];
app.get('/startGame/:ninerId', (req, res) => {
    if (req.params.ninerId) {
      if (!userObj[req.params.ninerId]) {
        dealerTotal = 0;
        players[req.params.ninerId] = {
          'score' : 0,
          'status' : null,
          'name' : "player " + playerCount
        };
        userObj[req.params.ninerId] = 0;
        playerCount ++;
        res.send("You are player "+ playerCount);
      }else {
        playerCount ++;
        res.send("You are player "+ playerCount);
      }
    }else{
      res.send("Enter Your Niner ID !");
    }
})
app.get('/hit/:ninerId', (req, res) => {
  console.log(userObj[req.params.ninerId]);
    if (userObj[req.params.ninerId] != undefined) {
      if (userObj[req.params.ninerId] == 0) {
        let t_card = [];
        let d_card = [];

        d_first = 0;

        t_card[0] = random_item(cards);
        t_card[1] = random_item(cards);

        d_card[0] = random_item(cards);
        d_card[1] = random_item(cards);

        d_first = d_card[0]
        dealerTotal = d_card[0] + d_card[1];
        userObj[req.params.ninerId] = t_card[0] + t_card[1];
        players[req.params.ninerId].score = t_card[0] + t_card[1];
        players[req.params.ninerId].status = 'Active';
        res.json({
          "cards" : t_card,
          "total" : userObj[req.params.ninerId],
          "info" : players,
          "dealerHand" : [d_first]
        });
      } else {
        let s_card = random_item(cards);
        userObj[req.params.ninerId] += s_card;
        players[req.params.ninerId].score += s_card
        console.log(userObj[req.params.ninerId], players[req.params.ninerId].score);
        if (userObj[req.params.ninerId] > 21) {
          players[req.params.ninerId].status = 'Busted';
          let temp = userObj[req.params.ninerId];
          userObj[req.params.ninerId] = 0;
          players[req.params.ninerId].score = 0;
          bustedArray.push(req.params.ninerId)
          d_first = 0;
          res.json({
            "cards" : "Busted",
            "total"  : temp,
            "info" : players
          });
        }else {
          players[req.params.ninerId].score = userObj[req.params.ninerId];
          players[req.params.ninerId].status = 'Active';
          res.json({
            "cards" : [s_card],
            "total" : userObj[req.params.ninerId],
            "info" : players,
            "dealerHand" : [d_first]
          });
        }
      }
    }else{
      res.send("Please start the game and then Hit !");
    }
})

app.get('/stand/:ninerId', (req, res) => {

  console.log(bustedArray.indexOf(req.params.ninerId));
    if (userObj[req.params.ninerId] != undefined) {
      let temp = userObj[req.params.ninerId];
      players[req.params.ninerId].status = 'Stand';
      standIndexArray.push(req.params.ninerId);
      standArray.push(userObj[req.params.ninerId]);
      console.log(standArray, standIndexArray.indexOf('1001'));
      res.json({
        "cards" : "Stand",
        "total"  : temp,
        "info" : players
      });


      // while(dealerTotal < 17){
      //   console.log("while 1 "+dealerTotal);
      //   let rand_card = random_item(cards);
      //   console.log(rand_card);
      //   dealerTotal += rand_card
      //   console.log("while 2 "+dealerTotal);
      // }

      // if (dealerTotal > 21) {
      //   res.json({
      //     "total" : temp,
      //     "result"  : "Dealer Busted, you Won !",
      //     "Win" : true
      //   })
      // }else{
      //     if (dealerTotal > temp) {
      //       res.json({
      //         "total" : temp,
      //         "result"  : "Dealer Won, you Lost !",
      //         "Win" : false
      //       })
      //     }else if (dealerTotal < temp) {
      //       res.json({
      //         "total" : temp,
      //         "result"  : "Dealer Lost, you Won !",
      //         "Win" : true
      //       })
      //     }else{
      //       res.json({
      //         "total" : temp,
      //         "result"  : "Dealer you Won draw !",
      //         "Win" : false
      //       })
      //     }
      // }
    }else{
      res.send("Please start the game and then Hit !");
    }
})

app.get('/checkResult/:ninerId', (req, res) => {
  if (standArray.length + bustedArray.length == 4) {
    if (standArray.length  == 0 ) {
      winners.push("No winner");
      reset();
         res.send("No winner");
    }else if (bustedArray.length == 4) {
      winners.push("No winner")
      reset();
        res.send("No winner");
    }else {
      let maxVal = standArray.max();
      let count = 0 ;
      for (var i = 0; i < standArray.length; i++) {
        if (maxVal == standArray[i]) {
          count ++ ;
        }
      }
      if (count > 1) {
        winners.push("Drawn");
        reset();
        res.send("match drawn");

      }else{
        console.log(maxVal,standIndexArray);
        // check if two players have same total
        let playerId = standArray.indexOf(maxVal);
        let winner = standIndexArray[playerId]
        winners.push("player "+winner+ " Won");
        reset();
        res.send("player "+winner+ " Won");
      }
    }
  }else {
    res.send("Game in Progress");
  }
});

app.get('/winners', (req, res) => {
  res.json(winners);
});

function reset(){
  standArray = []
  bustedArray = []
  standIndexArray = []
  players = {};
  userObj = {}
}
function random_item(items)
{

return items[Math.floor(Math.random()*items.length)];

}
app.listen(port, () => console.log('Example app listening on port 3900!'))
