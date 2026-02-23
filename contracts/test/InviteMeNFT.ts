import { ethers } from "hardhat";
import { expect } from "chai";

describe("InviteMeNFT", () => {
  let inviteNFT: any;
  let owner: any;
  let host: any;
  let guest: any;

  beforeEach(async () => {
    [owner, host, guest] = await ethers.getSigners();
    const InviteNFT = await ethers.getContractFactory("InviteMeNFT");
    inviteNFT = await InviteNFT.deploy();
    await inviteNFT.waitForDeployment();
  });

  describe("Event Creation", () => {
    it("should create an event", async () => {
      const tx = await inviteNFT.createEvent(
        "Birthday Party",
        Math.floor(Date.now() / 1000) + 86400 * 7,
        "123 Main St",
        50,
        false
      );
      await tx.wait();

      const event = await inviteNFT.events(1);
      expect(event.name).to.equal("Birthday Party");
      expect(event.host).to.equal(owner.address);
      expect(event.maxCapacity).to.equal(50);
    });
  });

  describe("Invite Minting", () => {
    beforeEach(async () => {
      const tx = await inviteNFT.createEvent("Birthday Party", Math.floor(Date.now() / 1000) + 86400 * 7, "123 Main St", 50, false);
      await tx.wait();
    });

    it("should mint an invite", async () => {
      const tx = await inviteNFT.mintInvite(1, guest.address, "https://ipfs.io/ipfs/metadata/1.json");
      await tx.wait();

      // Token ID should be 1
      expect(await inviteNFT.ownerOf(1)).to.equal(guest.address);
      const invite = await inviteNFT.invites(1);
      expect(invite.eventId).to.equal(1);
      expect(invite.guest).to.equal(guest.address);
    });

    it("should batch mint invites", async () => {
      const tx = await inviteNFT.batchMintInvites(
        1,
        [guest.address, host.address],
        ["https://ipfs.io/ipfs/metadata/1.json", "https://ipfs.io/ipfs/metadata/2.json"]
      );
      await tx.wait();

      expect(await inviteNFT.ownerOf(1)).to.equal(guest.address);
      expect(await inviteNFT.ownerOf(2)).to.equal(host.address);
    });
  });

  describe("RSVP", () => {
    beforeEach(async () => {
      await (await inviteNFT.createEvent("Birthday Party", Math.floor(Date.now() / 1000) + 86400 * 7, "123 Main St", 50, false)).wait();
      await (await inviteNFT.mintInvite(1, guest.address, "https://ipfs.io/ipfs/metadata/1.json")).wait();
    });

    it("should allow guest to accept RSVP", async () => {
      await inviteNFT.connect(guest).rsvp(1, true);
      const invite = await inviteNFT.invites(1);
      expect(invite.status).to.equal(1); // Accepted
    });

    it("should allow guest to decline RSVP", async () => {
      await inviteNFT.connect(guest).rsvp(1, false);
      const invite = await inviteNFT.invites(1);
      expect(invite.status).to.equal(2); // Declined
    });

    it("should reject RSVP from non-invitee", async () => {
      await expect(inviteNFT.connect(host).rsvp(1, true)).to.be.revertedWith("Not the invitee");
    });
  });

  describe("Check-In", () => {
    beforeEach(async () => {
      await (await inviteNFT.createEvent("Birthday Party", Math.floor(Date.now() / 1000) + 86400 * 7, "123 Main St", 50, false)).wait();
      await (await inviteNFT.mintInvite(1, guest.address, "https://ipfs.io/ipfs/metadata/1.json")).wait();
      await inviteNFT.connect(guest).rsvp(1, true);
    });

    it("should allow host to check in guest", async () => {
      await inviteNFT.checkIn(1);
      const invite = await inviteNFT.invites(1);
      expect(invite.status).to.equal(3); // Attended
      expect(invite.checkInDate).to.be.gt(0);
    });

    it("should reject check-in without RSVP", async () => {
      // Mint another invite without RSVP
      await (await inviteNFT.mintInvite(1, host.address, "https://ipfs.io/ipfs/metadata/2.json")).wait();
      await expect(inviteNFT.checkIn(2)).to.be.revertedWith("Must RSVP first");
    });
  });

  describe("Transfer", () => {
    beforeEach(async () => {
      await (await inviteNFT.createEvent("Birthday Party", Math.floor(Date.now() / 1000) + 86400 * 7, "123 Main St", 50, false)).wait();
      await (await inviteNFT.mintInvite(1, guest.address, "https://ipfs.io/ipfs/metadata/1.json")).wait();
    });

    it("should transfer invite to new owner", async () => {
      await inviteNFT.connect(guest).transferInvite(1, host.address);
      expect(await inviteNFT.ownerOf(1)).to.equal(host.address);
      const invite = await inviteNFT.invites(1);
      expect(invite.guest).to.equal(host.address);
    });
  });
});

describe("InviteMeFactory", () => {
  let factory: any;
  let owner: any;
  let host: any;

  beforeEach(async () => {
    [owner, host] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("InviteMeFactory");
    factory = await Factory.deploy();
    await factory.waitForDeployment();
  });

  describe("Single Contract Mode", () => {
    it("should enable single contract mode", async () => {
      await factory.enableSingleContractMode();
      const contractAddr = await factory.getActiveContract();
      expect(contractAddr).to.not.equal(ethers.ZeroAddress);
    });

    it("should deploy new contract", async () => {
      const tx = await factory.deployNewContract();
      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);
    });

    it("should create event in single contract mode", async () => {
      await factory.enableSingleContractMode();
      await factory.createEventSingle(
        "Test Event",
        Math.floor(Date.now() / 1000) + 86400 * 7,
        "456 Oak Ave",
        100,
        false
      );
      const eventCount = await factory.getEventCount();
      expect(eventCount).to.equal(1);
    });

    it("should track host events", async () => {
      await factory.enableSingleContractMode();
      await factory.createEventSingle("Event 1", Math.floor(Date.now() / 1000) + 86400, "Loc A", 50, false);
      await factory.createEventSingle("Event 2", Math.floor(Date.now() / 1000) + 86400 * 2, "Loc B", 100, false);
      const hostEvents = await factory.getHostEvents(owner.address);
      expect(hostEvents.length).to.equal(2);
    });
  });
});
