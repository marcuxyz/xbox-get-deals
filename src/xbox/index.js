const { default: axios } = require("axios");
const Parser = require("./parser");

class Xbox {
  constructor(defaultURL, targetURL) {
    this.defaultURL = defaultURL;
    this.targetURL = targetURL;
    this.games = [];
  }

  async download() {
    let r = await axios.get(this.defaultURL);
    let totalPages = this.#paginate(r.data);
    let counter = 1;
    let ids = [];

    while (counter <= totalPages) {
      if (counter > 1) r = await axios.get(this.defaultURL);
      r.data.Items.map((item) => ids.push(item.Id));
      counter++;
    }

    this.#chunk(ids.flat(), 20).forEach(
      async (ids) => await this.#getDeals(ids)
    );
  }

  async #getDeals(ids) {
    const { data } = await axios.get(
      `${this.targetURL}${ids.join(",")}&market=BR&languages=pt-br`
    );
    const games = data.Products.map((product) => Parser.parse(product));
    this.games.push(...games);
  }

  #chunk(array, n) {
    return array
      .slice(0, ((array.length + n - 1) / n) | 0)
      .map((_, i) => array.slice(n * i, n * i + n));
  }

  #paginate(data) {
    const totalItems = data?.PagingInfo?.TotalItems;
    const itemsPerPage = 200;
    return Math.ceil(totalItems / itemsPerPage);
  }
}

module.exports = Xbox;
