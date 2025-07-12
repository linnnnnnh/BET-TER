### User flow

Setup the game -  Organiser
1. Create compaign: createCampaign(CampaignInput memory _campaign) 
2. Add some prices for the winners: addPrize(string memory _description, string memory _uri, uint256 _supply, uint256 _campaignId)

3. Create a the prediction game: createPredictionGame(uint256 _campaignId, string memory _question)

4. Start the prediction game: setCampaignActive(uint256 _campaignId, bool _isActive)

Play the prediction game - Spectators
5. Predict the scores: submitPredictions(uint256 _campaignId, uint8 _team1Score, uint8 _team2Score)

Provide result - Resolver
6. Provide the first halftime result: resolvePredictionGame(uint256 _campaignId, uint8 _team1Score, uint8 _team2Score)

Check result - Players of prediction game
7. Check if won the prediction game: checkPredictionResult(uint256 _campaignId)

Play the second halftime game: (3 scenarios)

a. Winner of prediction game
8a. Play the game using the granted ticket: playSecondHalftimeWithTicket(uint256 _campaignId)

b. Losers of prediction game and dont want to pay ticket
8b. - Watch the video and did the quizz to get free ticket: getSecondHalftimeFreeTicket(uint256 _campaignId) 
      - Play the game: playSecondHalftimeWithTicket(uint256 _campaignId)

c. Losers of prediction game and want to pay ticket
8c. - play: playSecondHalftimeWithChz(uint256 _campaignId)