const { deterministicPartitionKey } = require("./dpk")

describe("deterministicPartitionKey", () => {
	it("Returns the literal '0' when given no input", () => {
		const trivialKey = deterministicPartitionKey()
		expect(trivialKey).toBe("0")
	})

	it("Returns a key string starting with 'd2' and ends with 'bc1' when given {partitionKey: '1234'} as input", () => {
		const trivialKey = deterministicPartitionKey({ partitionKey: '1234' })
		expect(trivialKey).toBe("d2fc758a0e35b49fd52354823326c037df7d92bc6df6230c65b0e1b57e6e7803a00e76708f259e4467391b46e875ad14dd128ad4cc39d995a457b2866b972bc1")
	})
})
