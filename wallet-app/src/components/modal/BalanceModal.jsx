import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import { useAuthStore } from '../../store';

const BalanceModal = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [document, setDocument] = useState('');
  const [phone, setPhone] = useState('');

  const { user } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(document, phone);
    onClose();
  };

  useEffect(() => {
    if (user.document && user.phone) {
      setDocument(user.document);
      setPhone(user.phone);
    }
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaHideApp={false}
      className="bg-white w-full max-w-md mx-auto my-4 p-6 rounded-lg shadow-lg"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-2xl font-bold mb-4">Solicitar Saldo</h2>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label className="mb-2">Documento:</label>
        <input
          type="text"
          value={document}
          onChange={(e) => setDocument(e.target.value)}
          className="border p-2 mb-4 rounded-md"
          required
          data-testid="document-input"
        />
        <label className="mb-2">Número de Celular:</label>
        <input
          type="number"
          min="0"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 mb-4 rounded-md"
          required
          data-testid="phone-input"
        />
        <div className="flex justify-end mt-4 space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition-colors duration-200 mb-4"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors duration-200 mb-4"
          >
            Solicitar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BalanceModal;
