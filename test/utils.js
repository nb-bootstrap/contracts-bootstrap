const { web3 } = require("@openzeppelin/test-environment");
const { expect, assert } = require("chai");
const _ = require("lodash");

const expectEvent = async (contractsFactory, receipt, eventName, args = {}) => {
    receipt = _.isFunction(receipt.wait) ? await receipt.wait() : receipt;
    const _events = Object.keys(contractsFactory.interface.events).filter((o) => contractsFactory.interface.events[o].name == eventName);
    expect(_events.length == 1, `${eventName} event name not found.`).to.true;
    const _event = contractsFactory.interface.events[_events[0]];
    const _code = web3.eth.abi.encodeEventSignature(_events[0]);
    const _logs = receipt["events"].filter((o) => o.event === eventName);
    // _logs = _logs.length > 0 ? _logs : receipt["events"].filter((o) => o.event === eventName);
    expect(_logs.length > 0, `${eventName} event not found.`).to.true;
    if (Object.keys(args).length === 0) {
        return;
    }
    const _args = web3.eth.abi.decodeLog(_event.inputs, _logs[0].data, [_code]);
    assert.deepInclude(_args, args, `${eventName} event args is error.`);
};

const expectIncludes = (actual, expected, msg = "") => {
    assert.isObject(expected, msg);
    for (let p in expected) {
        let v1 = expected[p];
        let v2 = actual[p];
        if (web3.utils.isBN(v2) || web3.utils.isBigNumber(v2)) {
            expect(v2.toNumber(), `${msg}: ${p}[${v2}][${v1}]`).to.equals(v1);
        } else {
            expect(v2, `${msg}: ${p}[${v2}][${v1}]`).to.equals(v1);
        }
    }
};

module.exports = { expectEvent, expectIncludes };
