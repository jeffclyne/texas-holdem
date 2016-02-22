import Deck from 'card-deck';
import _ from 'underscore';

class Player {
  constructor(name, bankroll) {
    this.name = name;
    this.bankroll = bankroll;
    this.hand = [];
    this.currentBet = 0;
  }
}

class Engine {

  constructor() {
    this._deck = new Deck();
    this._deck.cards(['2s', '2h', '2d', '2c',
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
    this._deck.shuffle();
    this._players = [];
    this._activePlayers = [];
    this._communityCards = [];
    this._actIndex = 0;
    this._dealerIndex = 0;
    this._currentBet = 0;
    this._smallBlind = 5;
    this._pot = 0;
    this._ranker = require('handranker');

    this._gameState = {
      status: "NotStarted"
    }
  }

  addPlayer(name) {
    this._players.push(new Player(name, 1000));
  }

  dealHand() {
    this._activePlayers = this._players;

    // Blinds
    this._activePlayers[(this._dealerIndex + 1) % this._activePlayers.length].currentBet = this._smallBlind;
    this._activePlayers[(this._dealerIndex + 2) % this._activePlayers.length].currentBet = this._smallBlind * 2;
    this._pot += this._smallBlind * 3;
    this._currentBet = this._smallBlind * 2;
    this._actIndex = (this._dealerIndex + 3) % this._activePlayers.length;

    // Deal hands
    this._activePlayers.forEach(player => {
      player.hand.push(this._deck.draw());
      player.hand.push(this._deck.draw());
    });

    this._gameState.status = "PreFlop";
    this._gameState.activePlayer = this._activePlayers[this._actIndex];
    this._gameState.currentBet = this._currentBet;
    this._gameState.pot = this._pot;

    return this._gameState;
  }

  bet(amount) {
    this._players[this._actIndex].currentBet += amount;
    this._pot += amount;
    this._actIndex = (_actIndex + 1) % this._activePlayers.length;
  }

  /**
   * Fold the active player
   */
  fold() {

    // Check who would be the next player
    let nextPlayer = this._activePlayers[(this._actIndex+1) % this._activePlayers.length];
    this._activePlayers.splice(this._actIndex, 1);
    this._actIndex = this._activePlayers.indexOf(nextPlayer);

    this._gameState.activePlayer = this._activePlayers[this._actIndex];
    return this._gameState;
  }

  call() {
    bet(this._currentBet - this._players[this._actIndex].currentBet);
  }

  raise(amount) {
    call();
    bet(amount);
    this._currentBet += amount;
  }

  potRight() {
    this._activePlayers.forEach(player => {
      if (player.currentBet < this._currentBet) {
        return false;
      }
    });
    this._currentBet = 0;
    return true;
  }

  evalHands() {
    // Use handranker to rank the hands
    const hands = [];
    this._activePlayers.forEach(player => {
      hands.push({id: player.name, cards: player.hand});
    });
    const results = ranker.orderHands(hands, communityCards);
    const winners = [];

    // Find the winners
    this._players.forEach(player => {
      results[0].forEach(result => {
        if (player.name === result.id) {
          winners.push(player);
        }
      });
    });
    // const winnerShare = Math.floor(pot / winners.length);
  }

  dealCommunityCard(num) {
    this._.range(num).forEach(() => {
      this._communityCards.push(deck.draw());
    });
  }

  flop() {
    dealCommunityCard(3);
  }

  turn() {
    dealCommunityCard(1);
  }

  river() {
    dealCommunityCard(1);
  }

  get activePlayer() {
    return this._activePlayers[this._actIndex];
  }

  get players() {
    return this._players;
  }

  get currentBet() {
    return this._currentBet;
  }

  get pot() {
    return this._pot;
  }
}

module.exports = {
  Engine
}
