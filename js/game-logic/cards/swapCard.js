import Card from "../cards.js";

/**
 * Parent class for any card that that swaps the next player postion
 * such as snakes or ladders
 * @augments Card
 */
export default class swapCard extends Card {
 
  constructor() {
    //TODO: validate
    super();
  }

  /**
   * @override
   */
  get name(){
    return `Swap`;
  }

  /**
   * swap two players 
   * @inheritdoc
   * @override
   * @param {Game} game game state to affect
   * @param {PlayerGameData} _player the player who activated the card
   * @param {number} other other player id
   */
  effect(game,player,other) {
    // Note: this relies on Points being immutable
    // otherwise we should copy data first
    // TODO: confirm if this is fine

    // if no other, assume this means it's me
    if (!other){
      other = player.playerId;
    }
    let tempPostion = player.postion;
    player.postion = other.postion;
    other.postion = tempPostion
  
  }
}
