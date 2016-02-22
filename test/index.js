import assert from 'assert';
import holdem from '../lib/holdem';
import chai from 'chai';
const should = chai.should();

describe('texas-holdem', () => {
  it('should deal hands to all players', () => {
    holdem.addPlayer('Player 1');
    holdem.addPlayer('Player 2');
    holdem.dealHand();

    holdem.players[0].hand.length.should.equal(2);
    holdem.players[1].hand.length.should.equal(2);
  });
});
