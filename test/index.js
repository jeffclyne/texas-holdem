import assert from 'assert';
import holdem from '../lib/holdem';
import chai from 'chai';
const should = chai.should();

describe('texas-holdem', () => {
  let engine = new holdem.Engine();
  afterEach(() => {
    engine = new holdem.Engine();
  });

  it('should deal hands to all players', () => {
    engine.addPlayer('Player 1');
    engine.addPlayer('Player 2');
    const state = engine.dealHand();

    state.status.should.equal('PreFlop');
    engine.players[0].hand.length.should.equal(2);
    engine.players[1].hand.length.should.equal(2);
  });

  it('should correctly add the blinds', () => {
    engine.addPlayer('Player 1');
    engine.addPlayer('Player 2');
    engine.addPlayer('Player 3');
    let state = engine.dealHand();

    engine.players[0].currentBet.should.equal(0);
    engine.players[1].currentBet.should.equal(5);
    engine.players[2].currentBet.should.equal(10);
    state.pot.should.equal(15);
    state.currentBet.should.equal(10);
  });

  it('should set the active player', () => {
    engine.addPlayer('Player 1');
    engine.addPlayer('Player 2');
    engine.addPlayer('Player 3');
    let state = engine.dealHand();

    state.activePlayer.name.should.equal('Player 1');
  });

  it('should handle a call', () => {
    engine.addPlayer('Player 1');
    engine.addPlayer('Player 2');
    engine.addPlayer('Player 3');
    engine.dealHand();
    let state = engine.call();

    state.status.should.equal('PreFlop');
    state.activePlayer.name.should.equal('Player 2');
    engine.players[0].currentBet.should.equal(10);
    state.pot.should.equal(25);
  });

  it('should handle folds', () => {
    engine.addPlayer('Player 1');
    engine.addPlayer('Player 2');
    engine.addPlayer('Player 3');
    engine.addPlayer('Player 4');
    engine.dealHand();

    let state = engine.fold();

    state.activePlayer.name.should.equal('Player 1');
  });

  it('should declare a winner if second to last player folds', () => {
    engine.addPlayer('Player 1');
    engine.addPlayer('Player 2');
    engine.dealHand();
    let state = engine.fold();

    state.status.should.equal('Finished');
    state.winner.should.equal('Player 1');
  });
});
