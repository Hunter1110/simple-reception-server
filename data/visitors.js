class Visitors {
  constructor() {
    this.data = [];
    this.nextIdValue = 0;
    this.init();
  }

  init() {
    for(let i = 0; i < 10; i++){
      this.create("FN" + (i + 1), "LN" + (i + 1), "AOpen", "+86" + (10000 + i));
    }
  }

  get nextId() {
    this.nextIdValue++;
    return this.nextIdValue;
  }

  get visitors() {
    return this.data;
  }

  create(firstName, lastName, companyName, mobile) {
    let visitor = this.findByMobile(mobile);
    if (visitor) {
      return this.update(visitor, firstName, lastName, companyName);
    }

    const nextId = this.nextId;
    const countryCode = mobile.substring(0, 3);
    visitor = {
      id: nextId,
      instanceId: nextId,
      firstName,
      lastName,
      companyName,
      note: null,
      mobile: mobile.substring(3),
      countryCode,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      deletedAt: null
    };
    this.visitors.push(visitor);
    return visitor;
  }

  update(visitor, firstName, lastName, companyName) {    
    visitor.firstName = firstName;
    visitor.lastName = lastName;
    visitor.companyName = companyName;
    visitor.updatedAt = Date.now();
    return visitor;
  }

  findByMobile(mobile) {    
    return this.visitors.find(vistor => 
      (vistor.countryCode + vistor.mobile) === mobile);
  }

  findById(id) {
    return this.visitors.find(visitor => 
      (visitor.id === id));
  }

  findByToken(mobile, token) {
    return this.visitors.find(visitor => 
      ((visitor.countryCode + visitor.mobile) === mobile));
  }

  findByIdAndToken(id, mobile, token) {
    return this.visitors.find(visitor => 
      (visitor.id == id && (visitor.countryCode + visitor.mobile) === mobile));
  }

  exist(mobile) {
    const visitor = this.findByMobile(mobile);
    if (visitor) return true;
    return false;
  }
}

module.exports = new Visitors();