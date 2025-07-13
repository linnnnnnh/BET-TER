// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {Better} from "../src/Better.sol";
import {console2} from "forge-std/console2.sol";

contract BetterTest is Test {
    Better public better;

    // Spicy testnet addresses
    address constant PYTH_ADDRESS = 0x23f0e8FAeE7bbb405E7A7C3d60138FCfd43d7509;
    bytes32 constant CHZ_USD_PRICE_ID = 0xe799f456b358a2534aa1b45141d454ac04b444ed23b1440b778549bb758f2b5c;
    address constant TRUSTED_DATA_RESOLVER = 0xfeb80317a68352c086B5f0CbE23898c000034CA4;
    address constant INITIAL_OWNER = 0xf58A0147d122Df314F0C557B58624C785C4a4CC5;
    address constant ENTROPY_ADDRESS = 0xD458261E832415CFd3BAE5E416FdF3230ce6F134;
    address constant WOW_TOKEN_ADDRESS = 0x0000000000000000000000000000000000000000;

    string public SPICY_RPC_URL = vm.envString("SPICY_RPC_URL");

    function setUp() public {
        // Create fork of Spicy testnet
        uint256 forkId = vm.createFork(SPICY_RPC_URL);
        vm.selectFork(forkId);

        better = new Better(
            PYTH_ADDRESS, CHZ_USD_PRICE_ID, TRUSTED_DATA_RESOLVER, INITIAL_OWNER, ENTROPY_ADDRESS, WOW_TOKEN_ADDRESS
        );
    }

    function testDeployment() public view {
        assertEq(better.name(), "PSG Reward");
        assertEq(better.symbol(), "PSGR");
        assertEq(better.owner(), INITIAL_OWNER);
        assertEq(better.trustedDataResolver(), TRUSTED_DATA_RESOLVER);
        assertEq(better.nextCampaignId(), 1);
        assertEq(better.nextPrizeId(), 1);
        assertEq(better.playFeeInUsdCents(), 100);
    }

    function testCreateCampaign() public {
        // Test variables
        uint256 id = 1;
        string memory team1 = "PSG";
        string memory team2 = "Real Madrid";
        uint256 startTimePredictionGame = block.timestamp + 1 hours;
        uint256 endTimePredictionGame = block.timestamp + 2 hours;
        uint256 startTimeSecondHalftimeGame = block.timestamp + 3 hours;
        uint256 endTimeSecondHalftimeGame = block.timestamp + 4 hours;

        vm.prank(INITIAL_OWNER);

        better.createCampaign(
            Better.CampaignInput(
                id,
                team1,
                team2,
                startTimePredictionGame,
                endTimePredictionGame,
                startTimeSecondHalftimeGame,
                endTimeSecondHalftimeGame
            )
        );

        assertEq(better.nextCampaignId(), 2);
    }

    function testSubmitPredictions() public {
        // Test variables
        uint256 id = 1;
        string memory team1 = "PSG";
        string memory team2 = "Real Madrid";
        uint256 startTimePredictionGame = block.timestamp + 1 hours;
        uint256 endTimePredictionGame = block.timestamp + 2 hours;
        uint256 startTimeSecondHalftimeGame = block.timestamp + 3 hours;
        uint256 endTimeSecondHalftimeGame = block.timestamp + 4 hours;

        // First create a campaign
        vm.prank(INITIAL_OWNER);
        better.createCampaign(
            Better.CampaignInput(
                id,
                team1,
                team2,
                startTimePredictionGame,
                endTimePredictionGame,
                startTimeSecondHalftimeGame,
                endTimeSecondHalftimeGame
            )
        );

        // Create prediction market
        string memory question = "What will be the final score?";

        vm.prank(INITIAL_OWNER);
        better.createPredictionGame(1, question);

        // Submit predictions
        uint8 team1Score = 1;
        uint8 team2Score = 2;

        better.submitPredictions(1, team1Score, team2Score);
    }

    function testGetPlayFeeInUsdCents() public view {
        // This will call the real Pyth oracle on the fork
        uint256 cost = better.getPlayFeeInUsdCents();
        console2.log("Cost in CHZ:", cost);
        assertGt(cost, 0, "Cost should be greater than 0");
    }

    function testPlaySecondHalftimeWithChz() public {
        // Test variables
        uint256 id = 1;
        string memory team1 = "PSG";
        string memory team2 = "Real Madrid";
        uint256 startTimePredictionGame = block.timestamp + 1 hours;
        uint256 endTimePredictionGame = block.timestamp + 2 hours;
        uint256 startTimeSecondHalftimeGame = block.timestamp + 3 hours;
        uint256 endTimeSecondHalftimeGame = block.timestamp + 4 hours;

        // Set up campaign
        vm.prank(INITIAL_OWNER);
        better.createCampaign(
            Better.CampaignInput(
                id,
                team1,
                team2,
                startTimePredictionGame,
                endTimePredictionGame,
                startTimeSecondHalftimeGame,
                endTimeSecondHalftimeGame
            )
        );

        vm.prank(INITIAL_OWNER);
        better.setCampaignActive(1, true);

        // Get required CHZ amount
        uint256 requiredChz = better.getPlayFeeInUsdCents();

        // Fund the contract with enough CHZ to pay entropy fees (about 1.5 ETH)
        vm.deal(address(better), 2 ether);

        // Play heatmap with CHZ
        vm.deal(address(this), requiredChz);
        better.playSecondHalftimeWithChz{value: requiredChz}(1);
    }

    function testPlaySecondHalftimeWithTicket() public {
        // Test variables
        uint256 campaignId = 1;
        string memory team1 = "PSG";
        string memory team2 = "Real Madrid";
        uint256 startTimePredictionGame = block.timestamp + 1 hours;
        uint256 endTimePredictionGame = block.timestamp + 2 hours;
        uint256 startTimeSecondHalftimeGame = block.timestamp + 3 hours;
        uint256 endTimeSecondHalftimeGame = block.timestamp + 4 hours;

        // Setup addresses
        address spectator = address(0x123);
        address resolver = TRUSTED_DATA_RESOLVER;

        // 1. Create campaign (Organiser)
        vm.prank(INITIAL_OWNER);
        better.createCampaign(
            Better.CampaignInput(
                campaignId,
                team1,
                team2,
                startTimePredictionGame,
                endTimePredictionGame,
                startTimeSecondHalftimeGame,
                endTimeSecondHalftimeGame
            )
        );

        // 2. Add some prizes for the winners (Organiser)
        vm.startPrank(INITIAL_OWNER);
        better.addPrize("Top Prize", "ipfs://top-prize-uri", 10, campaignId);
        better.addPrize("Mid Prize", "ipfs://mid-prize-uri", 50, campaignId);
        vm.stopPrank();

        // 3. Create the prediction game (Organiser)
        vm.prank(INITIAL_OWNER);
        better.createPredictionGame(campaignId, "What will be the final score?");

        // 4. Start the prediction game (Organiser)
        vm.prank(INITIAL_OWNER);
        better.setCampaignActive(campaignId, true);

        // 5. Predict the scores (Spectator)
        uint8 predictedTeam1Score = 2;
        uint8 predictedTeam2Score = 1;

        vm.prank(spectator);
        better.submitPredictions(campaignId, predictedTeam1Score, predictedTeam2Score);

        // 6. Provide the first halftime result (Resolver)
        // Make the spectator win by providing the same scores they predicted
        vm.prank(resolver);
        better.resolvePredictionGame(campaignId, predictedTeam1Score, predictedTeam2Score);

        // 7. Check if won the prediction game (Player)
        vm.prank(spectator);
        bool wonTicket = better.checkPredictionResult(campaignId);

        // Verify the spectator won the prediction game
        assertTrue(wonTicket, "Spectator should have won the prediction game");
        assertTrue(better.userHasHalftimeTicket(spectator), "Spectator should have a halftime ticket");

        // 8a. Play the game using the granted ticket (Winner)
        // Fund the contract with enough ETH for entropy fee (needs about 1.5 ETH)
        vm.deal(address(better), 2 ether);

        vm.prank(spectator);
        better.playSecondHalftimeWithTicket(campaignId);

        // Verify the ticket was consumed
        assertFalse(better.userHasHalftimeTicket(spectator), "Ticket should be consumed after playing");

        console2.log("Test completed successfully: Winner played second halftime with ticket");
    }

    function testPlaySecondHalftimeWithTicket_RevertIfNoTicket() public {
        // Test variables
        uint256 campaignId = 1;
        string memory team1 = "PSG";
        string memory team2 = "Real Madrid";
        uint256 startTimePredictionGame = block.timestamp + 1 hours;
        uint256 endTimePredictionGame = block.timestamp + 2 hours;
        uint256 startTimeSecondHalftimeGame = block.timestamp + 3 hours;
        uint256 endTimeSecondHalftimeGame = block.timestamp + 4 hours;

        address spectator = address(0x123);

        // Setup campaign
        vm.prank(INITIAL_OWNER);
        better.createCampaign(
            Better.CampaignInput(
                campaignId,
                team1,
                team2,
                startTimePredictionGame,
                endTimePredictionGame,
                startTimeSecondHalftimeGame,
                endTimeSecondHalftimeGame
            )
        );

        vm.prank(INITIAL_OWNER);
        better.setCampaignActive(campaignId, true);

        // Try to play without a ticket - should revert
        vm.prank(spectator);
        vm.expectRevert(Better.NoFreeTickets.selector);
        better.playSecondHalftimeWithTicket(campaignId);
    }

    function testPlaySecondHalftimeWithTicket_RevertIfCampaignNotActive() public {
        // Test variables
        uint256 campaignId = 1;
        string memory team1 = "PSG";
        string memory team2 = "Real Madrid";
        uint256 startTimePredictionGame = block.timestamp + 1 hours;
        uint256 endTimePredictionGame = block.timestamp + 2 hours;
        uint256 startTimeSecondHalftimeGame = block.timestamp + 3 hours;
        uint256 endTimeSecondHalftimeGame = block.timestamp + 4 hours;

        address spectator = address(0x123);

        // Setup campaign but don't activate it
        vm.prank(INITIAL_OWNER);
        better.createCampaign(
            Better.CampaignInput(
                campaignId,
                team1,
                team2,
                startTimePredictionGame,
                endTimePredictionGame,
                startTimeSecondHalftimeGame,
                endTimeSecondHalftimeGame
            )
        );

        // Try to play on inactive campaign - should revert
        vm.prank(spectator);
        vm.expectRevert(Better.CampaignNotActive.selector);
        better.playSecondHalftimeWithTicket(campaignId);
    }

    receive() external payable {}
}
