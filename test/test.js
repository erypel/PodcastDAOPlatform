var expect = require('chai').expect;

function test(){
	return 1
}

describe('test()', function() {
	it('should return 1', function() {
		//ARRANGE
		let expected = 1
		
		//ACT
		let val = test()
		
		//ASSERT
		expect(val).to.be.equal(expected)
	})
})