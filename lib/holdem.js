let deck = new Deck();
deck.cards(['2s', '2h', '2d', '2c',
            '3s', '3h', '3d', '3c',
            '4s', '4h', '4d', '4c',
            '5s', '5h', '5d', '5c',
            '6s', '6h', '6d', '6c',
            '7s', '7h', '7d', '7c',
            '8s', '8h', '8d', '8c',
            '9s', '9h', '9d', '9c',
            '10s', '10h', '10d', '10c',
            'Js', 'Jh', 'Jd', 'Jc',
            'Qs', 'Qh', 'Qd', 'Qc',
            'Ks', 'Kh', 'Kd', 'Kc',
            'As', 'Ah', 'Ad', 'Ac',])
deck.shuffle();

let players = [];
let activePlayers = [];
let communityCards = [];
let actIndex = 0;
let dealerIndex = 0;
let currentBet = 0;
let smallBlind = 5;

addPlayer = (name) => {
  players.push(new Player(name, 1000));
}

dealHand = () => {
  activePlayers = players;

  //Blinds
  activePlayers[dealerIndex+1].currentBet = smallBlind;
  activePlayers[dealerIndex+2].currentBet = smallBlind * 2;
  currentBet = smallBlind * 2;
  actIndex = dealerIndex + 3;

  //Deal hands
  for (player in activePlayers) {
    player.hand.push(deck.draw());
  }
}

/**
 * Fold the active player
 */
fold = () => {
  activePlayers.splice(actIndex, 1);
  actIndex = actIndex % activePlayers.length;
}

call = () => {
  bet(currentBet - players[actIndex].currentBet);
}

raise = (amount) => {
  call();
  bet(amount);
  currentBet += amount;
}

bet = (amount) => {
  players[actIndex].currentBet += amount;
  actIndex = (actIndex + 1) % activePlayers.length;
}

potRight = () => {
  for (player in activePlayers) {
    if (player.currentBet < currentBet) {
      return false;
    }
  }
  currentBet = 0;
  return true;
}

flop = () => {
  dealCommunityCard(3);
}

turn = () => {
  dealCommunityCard(1);
}

river = () => {
  dealCommunityCard(1);
}

dealCommunityCard = (num) => {
  for (i in range(num)) {
    communityCards.push(deck.draw());
  }
}


export default {};
