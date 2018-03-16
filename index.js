const express = require('express')
const app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

let userObj = {}
let dealerTotal = 0;
let d_first;
let cards = [1,2,3,4,5,6,7,8,9,10, 10, 10, 10];

app.get('/startGame/:ninerId', (req, res) => {
    if (req.params.ninerId) {
      if (!userObj[req.params.ninerId]) {
        dealerTotal = 0;
        userObj[req.params.ninerId] = 0;
        res.send("You can start the game !");
      }else {
        res.send("You can start the game !");
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

        res.json({
          "cards" : t_card,
          "total" : userObj[req.params.ninerId],
          "dealerHand" : [d_first]
        });
      } else {
        let s_card = random_item(cards);
        userObj[req.params.ninerId] += s_card;
        console.log(userObj[req.params.ninerId]);
        if (userObj[req.params.ninerId] > 21) {
          let temp = userObj[req.params.ninerId];
          userObj[req.params.ninerId] = 0;
          d_first = 0;
          res.json({
            "cards" : "Busted",
            "total"  : temp
          });
        }else {
          res.json({
            "cards" : [s_card],
            "total" : userObj[req.params.ninerId],
            "dealerHand" : [d_first]
          });
        }
      }
    }else{
      res.send("Please start the game and then Hit !");
    }
})

app.get('/stand/:ninerId', (req, res) => {
  console.log(userObj[req.params.ninerId]);
    if (userObj[req.params.ninerId] != undefined) {
      let temp = userObj[req.params.ninerId];
      userObj[req.params.ninerId] = 0;

      while(dealerTotal < 17){
        console.log("while 1 "+dealerTotal);
        let rand_card = random_item(cards);
        console.log(rand_card);
        dealerTotal += rand_card
        console.log("while 2 "+dealerTotal);
      }

      if (dealerTotal > 21) {
        res.json({
          "total" : temp,
          "result"  : "Dealer Busted, you Won !",
          "Win" : true
        })
      }else{
          if (dealerTotal > temp) {
            res.json({
              "total" : temp,
              "result"  : "Dealer Won, you Lost !",
              "Win" : false
            })
          }else if (dealerTotal < temp) {
            res.json({
              "total" : temp,
              "result"  : "Dealer Lost, you Won !",
              "Win" : true
            })
          }else{
            res.json({
              "total" : temp,
              "result"  : "Dealer you Won draw !",
              "Win" : false
            })
          }
      }
    }else{
      res.send("Please start the game and then Hit !");
    }
})

function random_item(items)
{

return items[Math.floor(Math.random()*items.length)];

}
app.listen(process.env.PORT || 3988, () => console.log('Example app listening on port 3988!'))
