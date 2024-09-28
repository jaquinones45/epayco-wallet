import { useEffect, useState } from 'react';

import CustomModal from '../../../components/modal/CustomModal';
import { allProducts, create, remove, update } from '../../../services/product';

const ProductsListView = () => {
  const [products, setProducts] = useState([]);

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [urlImage, setUrlImage] = useState('');

  const [editIndex, setEditIndex] = useState(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      updateProduct()
      setEditIndex(null);
    } else {
      creteProduct();
    }
    resetForm();
  };

  const resetForm = () => {
    setId('');
    setName('');
    setPrice('');
    setQuantity('');
    setUrlImage('');

    setModalIsOpen(false);
    setModalIsOpen(false);
    setDeleteModalIsOpen(false);
  };

  const handleCreate = () => {
    setEditIndex(null);
    setModalIsOpen(true);
  };

  const handleEdit = (index) => {
    const product = products[index];
    setId(product.id);
    setName(product.name);
    setPrice(product.price);
    setQuantity(product.quantity);
    setUrlImage(product.urlImage);
    setEditIndex(index);
    setModalIsOpen(true);
  };

  const handleDeleteConfirmation = (index) => {
    const product = products[index];
    setId(product.id);
    setDeleteModalIsOpen(true);
  };

  const handleDelete = () => {
    setDeleteModalIsOpen(false);
    deleteProduct();
  };

  const creteProduct = async () => {
    try {
      const { message } = await create({
        name,
        price,
        quantity,
        urlImage,
      });
      getAllProducts();
      alert(message);
    } catch (error) {
      alert(error.response.data.message);
    }
  }

  const updateProduct = async () => {
    try {
      const { message } = await update({
        id,
        name,
        price,
        quantity,
        urlImage,
      });
      getAllProducts();
      alert(message);
    } catch (error) {
      alert(error.response.data.message);
    }
  }

  const deleteProduct = async () => {
    try {
      const { message } = await remove({
        id,
      });
      getAllProducts();
      alert(message);
    } catch (error) {
      alert(error.response.data.message);
    }
  }

  const getAllProducts = async () => {
    try {
      const data = await allProducts();
      setProducts(data);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Products</h2>
      <button onClick={() => handleCreate()} className="bg-blue-500 text-white p-1 rounded shadow hover:bg-blue-600 transition my-5">Create</button>

      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index} className="hover:bg-gray-100 transition">
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">{product.price}</td>
              <td className="border px-4 py-2">{product.quantity}</td>
              <td className="border px-4 py-2 flex space-x-2">
                <button onClick={() => handleEdit(index)} className="bg-yellow-500 text-white p-1 rounded shadow hover:bg-yellow-600 transition">Edit</button>
                <button onClick={() => handleDeleteConfirmation(index)} className="bg-red-500 text-white p-1 rounded shadow hover:bg-red-600 transition">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create Or Update Modal */}
      <CustomModal
        isOpen={modalIsOpen}
        onClose={() => resetForm()}
        title={editIndex ? 'Edit Product': 'Create Product'}
      >
        <form onSubmit={handleSubmit} >
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 mr-2 mb-2"
            required
          />
          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 mr-2 mb-2"
            required
          />
          <input
            type="quantity"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border p-2 mr-2 mb-2"
            required
          />
          <input
            type="urlImage"
            placeholder="UrlImage"
            value={urlImage}
            onChange={(e) => setUrlImage(e.target.value)}
            className="border p-2 mr-2 mb-2"
            required
          />
          <div className="flex justify-end mt-4">
            <button onClick={() => resetForm()} className="mr-2 bg-gray-300 p-2 rounded">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Save</button>
          </div>
        </form>
      </CustomModal>

      {/* Delete Confirmation Modal */}
      <CustomModal
        isOpen={deleteModalIsOpen}
        onClose={() => resetForm()}
        onConfirm={handleDelete}
        title="Confirm Deletion"
      >
        <p>Are you sure you want to delete this product?</p>
        <div className="flex justify-end mt-4">
          <button onClick={() => resetForm()} className="mr-2 bg-gray-300 p-2 rounded">Cancel</button>
          <button onClick={() => handleDelete()} className="bg-blue-500 text-white p-2 rounded">Save</button>
        </div>
      </CustomModal>
    </div>
  );
};

export default ProductsListView;
