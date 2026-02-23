// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./InviteMeNFT.sol";

/**
 * @title InviteMeFactory
 * @dev Factory contract to deploy and manage InviteMeNFT contracts
 * Supports both single contract mode and per-event contract deployment
 */
contract InviteMeFactory is Ownable {
    
    // Event information stored in factory (for single-contract mode)
    struct EventInfo {
        address contractAddress;
        uint256 eventId;
        address host;
        string name;
        uint256 date;
        bool isActive;
    }

    // Array of all events
    EventInfo[] public allEvents;
    
    // Mapping from host to their events
    mapping(address => uint256[]) public hostEventIndices;
    
    // Active InviteMeNFT contract (single contract mode)
    InviteMeNFT public activeContract;
    
    // Whether using single contract mode
    bool public useSingleContract;
    
    // Events
    event ContractDeployed(address indexed contractAddress, address indexed deployer);
    event EventCreated(uint256 indexed eventId, address indexed host, string name, uint256 date);
    event SingleContractModeEnabled(address indexed contractAddress);

    constructor() Ownable(msg.sender) {
        useSingleContract = false;
    }

    /**
     * @dev Enable single contract mode (one contract for all events)
     */
    function enableSingleContractMode() external onlyOwner {
        require(!useSingleContract, "Already in single contract mode");
        
        activeContract = new InviteMeNFT();
        useSingleContract = true;
        
        emit SingleContractModeEnabled(address(activeContract));
    }

    /**
     * @dev Deploy a new InviteMeNFT contract (multi-contract mode)
     */
    function deployNewContract() external returns (address) {
        InviteMeNFT newContract = new InviteMeNFT();
        
        emit ContractDeployed(address(newContract), msg.sender);
        return address(newContract);
    }

    /**
     * @dev Create event in single contract mode
     */
    function createEventSingle(
        string memory _name,
        uint256 _date,
        string memory _location,
        uint256 _maxCapacity,
        bool _isPrivate
    ) external returns (uint256) {
        require(useSingleContract, "Not in single contract mode");
        require(address(activeContract) != address(0), "No active contract");
        
        uint256 eventId = activeContract.createEvent(
            _name,
            _date,
            _location,
            _maxCapacity,
            _isPrivate
        );
        
        allEvents.push(EventInfo({
            contractAddress: address(activeContract),
            eventId: eventId,
            host: msg.sender,
            name: _name,
            date: _date,
            isActive: true
        }));
        
        hostEventIndices[msg.sender].push(allEvents.length - 1);
        
        emit EventCreated(eventId, msg.sender, _name, _date);
        return eventId;
    }

    /**
     * @dev Mint invite in single contract mode
     */
    function mintInviteSingle(
        uint256 _eventId,
        address _guest,
        string memory _metadataURI
    ) external returns (uint256) {
        require(useSingleContract, "Not in single contract mode");
        
        EventInfo storage eventInfo = allEvents[_eventId - 1]; // eventId is 1-indexed
        require(eventInfo.host == msg.sender, "Not the event host");
        
        return activeContract.mintInvite(_eventId, _guest, _metadataURI);
    }

    /**
     * @dev Get all events
     */
    function getAllEvents() external view returns (EventInfo[] memory) {
        return allEvents;
    }

    /**
     * @dev Get events for a host
     */
    function getHostEvents(address _host) external view returns (EventInfo[] memory) {
        uint256[] memory indices = hostEventIndices[_host];
        EventInfo[] memory hostEvents_ = new EventInfo[](indices.length);
        
        for (uint256 i = 0; i < indices.length; i++) {
            hostEvents_[i] = allEvents[indices[i]];
        }
        
        return hostEvents_;
    }

    /**
     * @dev Get total event count
     */
    function getEventCount() external view returns (uint256) {
        return allEvents.length;
    }

    /**
     * @dev Get active contract address
     */
    function getActiveContract() external view returns (address) {
        return address(activeContract);
    }
}
