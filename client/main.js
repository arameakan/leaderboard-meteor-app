import "./main.html";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";

PlayersList = new Mongo.Collection("players");

if (Meteor.isClient) {
  Meteor.subscribe("thePlayers");

  /**
   * @Helpers
   */
  Template.leaderboard.helpers({
    player: function() {
      const currentUserId = Meteor.userId();
      return PlayersList.find({}, { sort: { score: -1, name: 1 } });
    },
    selectedClass: function() {
      const playerId = this._id;
      const selectedPlayer = Session.get("selectedPlayer");
      if (playerId === selectedPlayer) {
        return "selected";
      }
    },
    showSelectedPlayer: function() {
      const selectedPlayer = Session.get("selectedPlayer");
      return PlayersList.findOne(selectedPlayer);
    }
  });

  /**
   * @Events
   */
  Template.leaderboard.events({
    "click .player": function() {
      const playerId = this._id;
      Session.set("selectedPlayer", playerId);
    },
    "click .increment": function() {
      const selectedPlayer = Session.get("selectedPlayer");
      Meteor.call("modifyPlayerScore", selectedPlayer, 5);
    },
    "click .decrement": function() {
      const selectedPlayer = Session.get("selectedPlayer");
      Meteor.call("modifyPlayerScore", selectedPlayer, -5);
    },
    "click .remove": function() {
      const selectedPlayer = Session.get("selectedPlayer");
      Meteor.call("removePlayerData", selectedPlayer);
    }
  });

  Template.addPlayerForm.events({
    "submit form": function(e) {
      e.preventDefault();
      const playerNameVar = e.target.playerName.value;
      const playerScoreVar = e.target.playerScore.value;
      Meteor.call("insertPlayerData", playerNameVar, playerScoreVar);
      e.target.playerName.value = "";
      e.target.playerScore.value = "";
    }
  });
}
