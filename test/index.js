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
    engine.dealHand();
    engine.players[0].hand.length.should.equal(2);
    engine.players[1].hand.length.should.equal(2);
  });

  it('should correctly add the blinds', () => {
    engine.addPlayer('Player 1');
    engine.addPlayer('Player 2');
    engine.addPlayer('Player 3');
    engine.dealHand();

    engine.players[0].currentBet.should.equal(0);
    engine.players[1].currentBet.should.equal(5);
    engine.players[2].currentBet.should.equal(10);
    engine.pot.should.equal(15);
    engine.currentBet.should.equal(10);
  });

  it('should set the active player', () => {
    engine.addPlayer('Player 1');
    engine.addPlayer('Player 2');
    engine.addPlayer('Player 3');
    engine.dealHand();

    engine.activePlayer.name.should.equal('Player 1');
  });
});
