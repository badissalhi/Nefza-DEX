async function main() {
    console.log(`Preparing deployment...\n`)

    // Fetch contract to deploy
    const Token = await ethers.getContractFactory("Token")

    // Fetch accounts
    const accounts = await ethers.getSigners()

    console.log(
        `Accounts fetched:\n${accounts[0].address}\n${accounts[1].address}\n`
    )

    // Deploy contracts
    const Nefza = await Token.deploy("NEFZA", "NFZ", "1000000")
    await Nefza.deployed()
    console.log(`Nefza Token Deployed to: ${Nefza.address}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
