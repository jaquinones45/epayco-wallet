import { useEffect, useState } from 'react';

import CustomModal from '../../../components/modal/CustomModal';
import { allUsers, create, remove, update } from '../../../services/user';

const ClientsListView = () => {
  const [clients, setClients] = useState([]);

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [editIndex, setEditIndex] = useState(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      updateUser()
      setEditIndex(null);
    } else {
      creteUser();
    }
    resetForm();
  };

  const resetForm = () => {
    setId('');
    setName('');
    setDocument('');
    setEmail('');
    setPassword('');
    setPhone('');

    setModalIsOpen(false);
    setModalIsOpen(false);
    setDeleteModalIsOpen(false);
  };

  const handleCreate = () => {
    setEditIndex(null);
    setModalIsOpen(true);
  };

  const handleEdit = (index) => {
    const client = clients[index];
    setId(client.id);
    setName(client.name);
    setDocument(client.document);
    setEmail(client.email);
    setPassword(client.password);
    setPhone(client.phone);
    setEditIndex(index);
    setModalIsOpen(true);
  };

  const handleDeleteConfirmation = (index) => {
    const client = clients[index];
    setId(client.id);
    setDeleteModalIsOpen(true);
  };

  const handleDelete = () => {
    setDeleteModalIsOpen(false);
    deleteUser();
  };

  const creteUser = async () => {
    try {
      const { message } = await create({
        name,
        document,
        email,
        password,
        phone,
      });
      getAllUsers();
      alert(message);
    } catch (error) {
      alert(error.response.data.message);
    }
  }

  const updateUser = async () => {
    try {
      const { message } = await update({
        id,
        name,
        document,
        email,
        password,
        phone,
      });
      getAllUsers();
      alert(message);
    } catch (error) {
      alert(error.response.data.message);
    }
  }

  const deleteUser = async () => {
    try {
      const { message } = await remove({
        id,
      });
      getAllUsers();
      alert(message);
    } catch (error) {
      alert(error.response.data.message);
    }
  }

  const getAllUsers = async () => {
    try {
      const data = await allUsers();
      setClients(data);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Clients</h2>
      <button onClick={() => handleCreate()} className="bg-blue-500 text-white p-1 rounded shadow hover:bg-blue-600 transition my-5">Create</button>

      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Document</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, index) => (
            <tr key={index} className="hover:bg-gray-100 transition">
              <td className="border px-4 py-2">{client.name}</td>
              <td className="border px-4 py-2">{client.document}</td>
              <td className="border px-4 py-2">{client.email}</td>
              <td className="border px-4 py-2">{client.phone}</td>
              <td className="border px-4 py-2">{client.role}</td>
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
        title={editIndex ? 'Edit Client': 'Create Client'}
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
            placeholder="Document"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            className="border p-2 mr-2 mb-2"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 mr-2 mb-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mr-2 mb-2"
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
        <p>Are you sure you want to delete this client?</p>
        <div className="flex justify-end mt-4">
          <button onClick={() => resetForm()} className="mr-2 bg-gray-300 p-2 rounded">Cancel</button>
          <button onClick={() => handleDelete()} className="bg-blue-500 text-white p-2 rounded">Save</button>
        </div>
      </CustomModal>
    </div>
  );
};

export default ClientsListView;
