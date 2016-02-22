import assert from 'assert';
import holdem from '../lib/holdem';

describe('texas-holdem', () => {
  it('should deal hands to all players', () => {
    holdem.addPlayer('Player 1');
    holdem.addPlayer('Player 2');

    assert(holdem.players[0].hand.length === 2);
    assert(holdem.players[1].hand.length === 2);
  });
});
