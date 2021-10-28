const { default: axios } = require("axios");
const Parser = require("./parser");

Array.prototype.chunk = function (n) {
  return this.slice(0, ((this.length + n - 1) / n) | 0).map((_, i) =>
    this.slice(n * i, n * i + n)
  );
};

class Xbox {
  constructor(defaultURL, targetURL) {
    this.defaultURL = defaultURL;
    this.targetURL = targetURL;
  }

  async download() {
    let r = await axios.get(this.defaultURL);
    let totalPages = this.#paginate(r.data);
    let counter = 1;
    let ids = [];
    let itemsPerPage = 0;

    while (counter <= totalPages) {
      if (counter > 1) {
        itemsPerPage = itemsPerPage + 200;
        r = await axios.get(this.defaultURL + `&skipitems=${itemsPerPage}`);
      }
      r.data.Items.map((item) => ids.push(item.Id));
      counter++;
    }

    return Promise.all(
      ids
        .flat()
        .chunk(20)
        .map((ids) => this.#getDeals(ids))
    ).then((games) => games.flat());
  }

  async #getDeals(ids) {
    const { data } = await axios.get(
      `${this.targetURL}${ids.join(",")}&market=BR&languages=pt-br`
    );
    return data.Products.map((product) => Parser.parse(product));
  }

  #paginate(data) {
    const totalItems = data?.PagingInfo?.TotalItems;
    const itemsPerPage = 200;
    return Math.ceil(totalItems / itemsPerPage);
  }
}

module.exports = Xbox;
