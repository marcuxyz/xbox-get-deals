const { default: axios } = require("axios");
const Xbox = require("../src/xbox");

jest.mock("axios");

describe(Xbox, () => {
  it("get content length", async () => {
    axios.get
      .mockReturnValue({ data: require("./fixtures/game-info.json") })
      .mockReturnValueOnce({ data: require("./fixtures/deal-page-1.json") })
      .mockReturnValueOnce({ data: require("./fixtures/deal-page-2.json") });

    const defaultURL = "https://xbox.faker";
    const targetURL = "https://xbox.faker/game/1";

    const xbox = new Xbox(defaultURL, targetURL);
    const deals = await xbox.download();

    expect(deals.length).toEqual(34);
    expect(deals[0]).toEqual({
      title: "AI: THE SOMNIUM FILES",
      poster:
        "https://store-images.s-microsoft.com/image/apps.60995.14532753298259851.fe5f1fef-6b24-4916-ae82-ce72a7c18637.20cd68f6-8a82-4d2c-9724-30a6e7ed8940",
      price: 147.45,
      wholeSalePrice: 92.78,
    });
  });
});
