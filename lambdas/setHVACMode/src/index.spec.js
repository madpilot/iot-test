const setHVACMode = require("./index").setHVACMode;
const TARGET = require("./index.js").TARGET;

describe("setHVACMode", () => {
  let temperature, iotInstance;

  let subject = () => {
    setHVACMode({ temperature: temperature });
  };

  let payloadMatcher = (expected) => {
    return sinon.match((value) => {
      let ret = true;
      let payload = JSON.parse(value.payload).state.requested;

      for(let key in expected) {
        ret = ret && payload[key] == expected[key];
      }
      return ret;
    }, "to have a requested state of " + JSON.stringify(expected));
  };

  beforeEach(() => {
    iotInstance = {
      publish: sinon.stub()
    }

    global.AWS = {
      IotData: sinon.stub().returns(iotInstance)
    };
  });

  describe("more than 10 degrees below target", () => {
    beforeEach(() => { temperature = TARGET - 11 });

    it("sets mode to heat", () => {
      subject();
      expect(iotInstance.publish).to.be.calledWith(payloadMatcher({mode: 'heat'}), sinon.match.func);
    });

    it("sets the fan speec to 3", () => {
      subject();
      expect(iotInstance.publish).to.be.calledWith(payloadMatcher({speed: 3}), sinon.match.func);
    });
  });

  describe("more than 7 degrees but less that 10 below target", () => {
    beforeEach(() => { temperature = TARGET - 8 });

    it("sets mode to heat", () => {
      subject();
      expect(iotInstance.publish).to.be.calledWith(payloadMatcher({mode: 'heat'}), sinon.match.func);
    });

    it("sets the fan speec to 2", () => {
      subject();
      expect(iotInstance.publish).to.be.calledWith(payloadMatcher({speed: 2}), sinon.match.func);
    });
  });

  describe("more than 5 degrees but less that 7 below target", () => {
    beforeEach(() => { temperature = TARGET - 6 });

    it("sets mode to heat", () => {
      subject();
      expect(iotInstance.publish).to.be.calledWith(payloadMatcher({mode: 'heat'}), sinon.match.func);
    });

    it("sets the fan speec to 1", () => {
      subject();
      expect(iotInstance.publish).to.be.calledWith(payloadMatcher({speed: 1}), sinon.match.func);
    });
  });

  describe("less that 5 below target", () => {
    beforeEach(() => { temperature = TARGET - 4 });

    it("sets mode to off", () => {
      subject();
      expect(iotInstance.publish).to.be.calledWith(payloadMatcher({mode: 'off'}), sinon.match.func);
    });

    it("sets the fan speec to 0", () => {
      subject();
      expect(iotInstance.publish).to.be.calledWith(payloadMatcher({speed: 0}), sinon.match.func);
    });
  });

  describe("less that 5 above target", () => {
    beforeEach(() => { temperature = TARGET + 4 });

    it("sets mode to off", () => {
      subject();
      expect(iotInstance.publish).to.be.calledWith(payloadMatcher({mode: 'off'}), sinon.match.func);
    });

    it("sets the fan speec to 0", () => {
      subject();
      expect(iotInstance.publish).to.be.calledWith(payloadMatcher({speed: 0}), sinon.match.func);
    });
  });

  describe("more than 5 degrees but less that 7 above target", () => {
    beforeEach(() => { temperature = TARGET + 6 });

    it("sets mode to cool", () => {
      subject();
      expect(iotInstance.publish).to.be.calledWith(payloadMatcher({mode: 'cool'}), sinon.match.func);
    });

    it("sets the fan speec to 1", () => {
      subject();
      expect(iotInstance.publish).to.be.calledWith(payloadMatcher({speed: 1}), sinon.match.func);
    });
  });

  describe("more than 7 degrees but less that 10 above target", () => {
    beforeEach(() => { temperature = TARGET + 8 });

    it("sets mode to cool", () => {
      subject();
      expect(iotInstance.publish).to.be.calledWith(payloadMatcher({mode: 'cool'}), sinon.match.func);
    });

    it("sets the fan speec to 2", () => {
      subject();
      expect(iotInstance.publish).to.be.calledWith(payloadMatcher({speed: 2}), sinon.match.func);
    });
  });

  describe("more than 10 degrees above target", () => {
    beforeEach(() => { temperature = TARGET + 11 });

    it("sets mode to cool", () => {
      subject();
      expect(iotInstance.publish).to.be.calledWith(payloadMatcher({mode: 'cool'}), sinon.match.func);
    });

    it("sets the fan speec to 3", () => {
      subject();
      expect(iotInstance.publish).to.be.calledWith(payloadMatcher({speed: 3}), sinon.match.func);
    });
  });
});
