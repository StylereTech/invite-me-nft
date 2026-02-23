// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title InviteMeNFT
 * @dev NFT-based event invitation system on Base
 */
contract InviteMeNFT is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {

    enum EventStatus { Upcoming, Active, Completed, Cancelled }
    enum InviteStatus { Pending, Accepted, Declined, Attended }

    uint256 private _nextTokenId;
    uint256 private _nextEventId;

    struct Event {
        string name;
        uint256 date;
        string location;
        uint256 maxCapacity;
        address host;
        bool isPrivate;
        EventStatus status;
    }

    struct Invite {
        uint256 eventId;
        address guest;
        InviteStatus status;
        uint256 rsvpDate;
        uint256 checkInDate;
    }

    mapping(uint256 => Event) public events;
    mapping(uint256 => Invite) public invites;
    mapping(uint256 => uint256[]) public eventInvites;
    mapping(address => uint256[]) public hostEvents;

    event EventCreated(uint256 indexed eventId, address indexed host, string name, uint256 date);
    event InviteMinted(uint256 indexed tokenId, uint256 indexed eventId, address indexed guest);
    event RSVPUpdated(uint256 indexed tokenId, address indexed guest, InviteStatus status);
    event CheckIn(uint256 indexed tokenId, address indexed guest, uint256 timestamp);
    event InviteTransferred(uint256 indexed tokenId, address indexed from, address indexed to);

    constructor() ERC721("Invite Me NFT", "INVITE") Ownable(msg.sender) {}

    function createEvent(
        string memory _name,
        uint256 _date,
        string memory _location,
        uint256 _maxCapacity,
        bool _isPrivate
    ) external returns (uint256) {
        _nextEventId++;
        uint256 eventId = _nextEventId;

        events[eventId] = Event({
            name: _name,
            date: _date,
            location: _location,
            maxCapacity: _maxCapacity,
            host: msg.sender,
            isPrivate: _isPrivate,
            status: EventStatus.Upcoming
        });

        hostEvents[msg.sender].push(eventId);
        emit EventCreated(eventId, msg.sender, _name, _date);
        return eventId;
    }

    function mintInvite(
        uint256 _eventId,
        address _guest,
        string memory _metadataURI
    ) public returns (uint256) {
        Event storage event_ = events[_eventId];
        require(event_.host == msg.sender || msg.sender == owner(), "Not authorized");
        require(event_.status == EventStatus.Upcoming, "Event not upcoming");
        require(eventInvites[_eventId].length < event_.maxCapacity, "At capacity");

        _nextTokenId++;
        uint256 tokenId = _nextTokenId;

        _safeMint(_guest, tokenId);
        _setTokenURI(tokenId, _metadataURI);

        invites[tokenId] = Invite({
            eventId: _eventId,
            guest: _guest,
            status: InviteStatus.Pending,
            rsvpDate: 0,
            checkInDate: 0
        });

        eventInvites[_eventId].push(tokenId);
        emit InviteMinted(tokenId, _eventId, _guest);
        return tokenId;
    }

    function batchMintInvites(
        uint256 _eventId,
        address[] memory _guests,
        string[] memory _metadataURIs
    ) external returns (uint256[] memory) {
        require(_guests.length == _metadataURIs.length, "Length mismatch");
        uint256[] memory tokenIds = new uint256[](_guests.length);
        for (uint256 i = 0; i < _guests.length; i++) {
            tokenIds[i] = mintInvite(_eventId, _guests[i], _metadataURIs[i]);
        }
        return tokenIds;
    }

    function rsvp(uint256 _tokenId, bool _accepted) external {
        Invite storage invite_ = invites[_tokenId];
        require(invite_.guest == msg.sender, "Not the invitee");
        require(invite_.status == InviteStatus.Pending, "Already responded");

        invite_.status = _accepted ? InviteStatus.Accepted : InviteStatus.Declined;
        invite_.rsvpDate = block.timestamp;
        emit RSVPUpdated(_tokenId, msg.sender, invite_.status);
    }

    function checkIn(uint256 _tokenId) external {
        Invite storage invite_ = invites[_tokenId];
        Event storage event_ = events[invite_.eventId];
        require(msg.sender == event_.host || msg.sender == owner(), "Not authorized");
        require(invite_.status == InviteStatus.Accepted, "Must RSVP first");
        require(invite_.checkInDate == 0, "Already checked in");

        invite_.status = InviteStatus.Attended;
        invite_.checkInDate = block.timestamp;
        emit CheckIn(_tokenId, invite_.guest, block.timestamp);
    }

    function transferInvite(uint256 _tokenId, address _to) external {
        require(ownerOf(_tokenId) == msg.sender, "Not token owner");
        invites[_tokenId].guest = _to;
        _transfer(msg.sender, _to, _tokenId);
        emit InviteTransferred(_tokenId, msg.sender, _to);
    }

    function getEventDetails(uint256 _eventId) external view returns (Event memory) {
        return events[_eventId];
    }

    function getInviteDetails(uint256 _tokenId) external view returns (Invite memory) {
        return invites[_tokenId];
    }

    function getEventInviteIds(uint256 _eventId) external view returns (uint256[] memory) {
        return eventInvites[_eventId];
    }

    function getHostEvents(address _host) external view returns (uint256[] memory) {
        return hostEvents[_host];
    }

    function updateEventStatus(uint256 _eventId, EventStatus _status) external {
        require(events[_eventId].host == msg.sender, "Not host");
        events[_eventId].status = _status;
    }

    function tokenURI(uint256 _tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(_tokenId);
    }

    function supportsInterface(bytes4 _interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(_interfaceId);
    }
}
