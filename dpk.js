const crypto = require("crypto")

exports.deterministicPartitionKey = (event) => {
	const MAX_PARTITION_KEY_LENGTH = 256
	let partitionKey = "0"

	if (event && event.partitionKey) {
		partitionKey = event.partitionKey
	}

	if (event) {
		partitionKey = crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex")
	}

	if (partitionKey && typeof partitionKey !== "string") {
		partitionKey = JSON.stringify(partitionKey)
	}

	if (partitionKey.length > MAX_PARTITION_KEY_LENGTH) {
		partitionKey = crypto.createHash("sha3-512").update(partitionKey).digest("hex")
	}

	return partitionKey
}


/**
 * First I changed the name 'candidate' to partitionKey because the word 'candidate' does not really explain the concept of the program.
 * I then removed the constant variable 'TRIVIAL_PARTITION_KEY' and set the initial value of '0' to the partitionKey variable then called 'candidate'. This is because the variable 'TRIVIAL_PARTITION_KEY' was actually ambiguous
 */