const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.nextId = 1;
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
      this.nextId = this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0) + 1;
    } catch (error) {
      this.products = [];
    }
  }

  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf8');
  }

  addProduct(productData) {
    const { title, description, price, thumbnail, code, stock } = productData;

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error("Todos los campos son obligatorios.");
      return;
    }

    if (this.products.some(product => product.code === code)) {
      console.error("El código ya está en uso. Introducí un código único.");
      return;
    }

    const newProduct = {
      id: this.nextId++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    };

    this.products.push(newProduct);
    this.saveProducts();
    console.log("Producto agregado correctamente:", newProduct);
  }

  getProducts() {
    this.loadProducts();
    return this.products;
  }

  getProductById(id) {
    this.loadProducts();
    const product = this.products.find(product => product.id === id);

    if (product) {
      return product;
    } else {
      console.error("Producto no encontrado. ID:", id);
      return null;
    }
  }

  updateProduct(id, updatedProduct) {
    this.loadProducts();
    const index = this.products.findIndex(product => product.id === id);

    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct };
      this.saveProducts();
      console.log("Producto actualizado correctamente:", this.products[index]);
    } else {
      console.error("Producto no encontrado. ID:", id);
    }
  }

  deleteProduct(id) {
    this.loadProducts();
    const index = this.products.findIndex(product => product.id === id);

    if (index !== -1) {
      const deletedProduct = this.products.splice(index, 1)[0];
      this.saveProducts();
      console.log("Producto eliminado correctamente:", deletedProduct);
    } else {
      console.error("Producto no encontrado. ID:", id);
    }
  }
}

const productManager = new ProductManager('products.json');
//El archivo 'products.json' serviría para que, al agregar productos con el método 'addProduct', estos se guarden el archivo ya mencionado.


// No sé si sea necesario, pero acá incluí un ejemplo.
productManager.addProduct({
  title: "Producto 1",
  description: "Descripción 1",
  price: 19.99,
  thumbnail: "imagen1.jpg",
  code: "P001",
  stock: 50
});

productManager.updateProduct(1, { stock: 45 });

const allProducts = productManager.getProducts();
console.log("Todos los productos:", allProducts);

const productById = productManager.getProductById(1);
console.log("Producto por ID:", productById);

productManager.deleteProduct(1);
