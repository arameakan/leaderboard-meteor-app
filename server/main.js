import { Meteor } from "meteor/meteor";

Meteor.startup(() => {
  // code to run on server at startup
});

PlayersList = new Mongo.Collection("players");

if (Meteor.isServer) {
  Meteor.publish("thePlayers", function() {
    const currentUserId = this.userId;
    return PlayersList.find({ createdBy: currentUserId });
  });

  Meteor.methods({
    insertPlayerData: function(playerNameVar, playerScoreVar) {
      const currentUserId = Meteor.userId();
      PlayersList.insert({
        name: playerNameVar,
        score: playerScoreVar,
        createdBy: currentUserId
      });
    },

    removePlayerData: function(selectedPlayer) {
      const currentUserId = Meteor.userId();
      PlayersList.remove({ _id: selectedPlayer, createdBy: currentUserId });
    },

    modifyPlayerScore: function(selectedPlayer, scoreValue) {
      const currentUserId = Meteor.userId();
      PlayersList.update(
        { _id: selectedPlayer, createdBy: currentUserId },
        { $inc: { score: scoreValue } }
      );
    }
  });
}
