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

    string public SPICY_RPC_URL = vm.envString("SPICY_RPC_URL");

    function setUp() public {
        // Create fork of Spicy testnet
        uint256 forkId = vm.createFork(SPICY_RPC_URL);
        vm.selectFork(forkId);

        better = new Better(PYTH_ADDRESS, CHZ_USD_PRICE_ID, TRUSTED_DATA_RESOLVER, INITIAL_OWNER, ENTROPY_ADDRESS);
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

        // Play heatmap with CHZ
        vm.deal(address(this), requiredChz);
        better.playSecondHalftimeWithChz{value: requiredChz}(1);
    }

    receive() external payable {}
}
