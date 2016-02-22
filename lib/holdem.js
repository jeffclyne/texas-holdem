import Deck from 'card-deck';
import _ from 'underscore';

const deck = new Deck();
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
  'As', 'Ah', 'Ad', 'Ac']);
deck.shuffle();

class Player {
  constructor(name, bankroll) {
    this.name = name;
    this.bankroll = bankroll;
    this.hand = [];
    this.currentBet = 0;
  }
}

const players = [];
let activePlayers = [];
const communityCards = [];
let actIndex = 0;
const dealerIndex = 0;
let currentBet = 0;
const smallBlind = 5;
let pot = 0;
const ranker = require('handranker');

const addPlayer = name => {
  players.push(new Player(name, 1000));
};

const dealHand = () => {
  activePlayers = players;

  // Blinds
  activePlayers[dealerIndex + 1].currentBet = smallBlind;
  activePlayers[dealerIndex + 2].currentBet = smallBlind * 2;
  pot += smallBlind * 3;
  currentBet = smallBlind * 2;
  actIndex = dealerIndex + 3;

  // Deal hands
  activePlayers.forEach(player => {
    player.hand.push(deck.draw());
  });
};

const bet = amount => {
  players[actIndex].currentBet += amount;
  pot += amount;
  actIndex = (actIndex + 1) % activePlayers.length;
};

/**
 * Fold the active player
 */
const fold = () => {
  activePlayers.splice(actIndex, 1);
  actIndex %= activePlayers.length;
};

const call = () => {
  bet(currentBet - players[actIndex].currentBet);
};

const raise = amount => {
  call();
  bet(amount);
  currentBet += amount;
};

const potRight = () => {
  activePlayers.forEach(player => {
    if (player.currentBet < currentBet) {
      return false;
    }
  });
  currentBet = 0;
  return true;
};

const evalHands = () => {
  // Use handranker to rank the hands
  const hands = [];
  activePlayers.forEach(player => {
    hands.push({id: player.name, cards: player.hand});
  });
  const results = ranker.orderHands(hands, communityCards);
  const winners = [];

  // Find the winners
  players.forEach(player => {
    results[0].forEach(result => {
      if (player.name === result.id) {
        winners.push(player);
      }
    });
  });
  // const winnerShare = Math.floor(pot / winners.length);
};

const dealCommunityCard = num => {
  _.range(num).forEach(() => {
    communityCards.push(deck.draw());
  });
};

const flop = () => {
  dealCommunityCard(3);
};

const turn = () => {
  dealCommunityCard(1);
};

const river = () => {
  dealCommunityCard(1);
};

export default {
  players,
  addPlayer,
  dealHand,
  fold,
  call,
  raise,
  potRight,
  evalHands,
  flop,
  turn,
  river
};
