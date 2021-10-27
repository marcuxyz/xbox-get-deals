const Xbox = require("../src/xbox")

describe("", () => {
  it("", () => {
    const default_url = ""
    const xbox = new Xbox(default_url)

    await xbox.download()
    const deals = xbox.deals()

    expect(deals.length).toEqual(308)
  })
})