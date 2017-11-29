const Visitors = require('./visitors');
const Hosts = require('./hosts');
class Checkins {
  constructor() {
    this.data = [];
    this.nextIdValue = 0;
  }

  get checkins() {
    return this.data;
  }
  get nextId() {
    this.nextIdValue++;
    return this.nextIdValue;
  }

  get signoutCode() {
    const num = Math.abs(Math.floor(Math.random() * 10000) - 1);
    return this.pad(num, 4);
  }

  pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  checkin(visitorId, hostId, timeIn) {
    const visitor = Visitors.findById(visitorId);
    if (!visitor) {
      return null;
    }

    const host = Hosts.hosts.find(host => host.id === hostId);
    if (!host) {
      return null;
    }
    const id = this.nextId;
    const checkin = {
      id,
      instanceId: id,
      hostId: hostId,
      visitorId: visitorId,
      checkinReasonId: null,
      note: null,
      signoutCode: this.signoutCode,
      timeIn: timeIn,
      timeOut: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      deletedAt: null
    };
    
    this.checkins.push(checkin);
    return checkin;
  }

  checkout(signoutCode) {
    const checkin = this.checkins.find(checkin => (!checkin.timeOut && checkin.signoutCode === signoutCode));
    if (checkin) {
      checkin.timeOut = Date.now();
      checkin.updatedAt = Date.now();
    }
    return checkin;
  }
}

module.exports = new Checkins();