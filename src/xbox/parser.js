class Parser {
  parse(product) {
    return {
      title: this.getTitle(product),
      poster: this.getPoster(product),
      price: this.getPrice(product),
      wholeSalePrice: this.getWholeSalePrice(product),
    };
  }

  getTitle(product) {
    return product.LocalizedProperties.map((prop) => prop.ProductTitle).join();
  }

  getPoster(product) {
    return product.LocalizedProperties.map((prop) =>
      prop.Images.filter((img) => img.ImagePurpose == "Poster").map(
        (img) => img.Uri
      )
    )
      .join()
      .replace("//", "https://");
  }

  getPrice(product) {
    return this.#extractPrice(product, "ListPrice");
  }

  getWholeSalePrice(product) {
    return this.#extractPrice(product, "WholesalePrice");
  }

  #extractPrice(product, target) {
    const prices = product.DisplaySkuAvailabilities.map((availability) =>
      availability.Availabilities.map(
        (availability) => availability.OrderManagementData.Price[target]
      )
    );
    return parseFloat(
      prices
        .flat()
        .filter((price) => price > 0)
        .slice(0, 1)
        .join()
    );
  }
}

module.exports = new Parser();
