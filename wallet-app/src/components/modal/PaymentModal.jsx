import React, { useState } from 'react';
import Modal from 'react-modal';

const PaymentModal = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [sessionId, setSessionId] = useState('');
  const [token, setToken] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const product_id = isOpen.product_id;
    onSubmit(sessionId, token, product_id);
    clearFields()
  };

  const clearFields = () => {
    setSessionId('');
    setToken('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen.open}
      onClose={clearFields}
      ariaHideApp={false}
      className="bg-white w-full max-w-md mx-auto my-4 p-6 rounded-lg shadow-lg"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-2xl font-bold mb-4">Confirmar Compra</h2>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label className="mb-2">ID de Sesión:</label>
        <input
          type="text"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          className="border p-2 mb-4 rounded-md"
          required
          data-testid="session-id-input"
        />
        <label className="mb-2">Token:</label>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="border p-2 mb-4 rounded-md"
          required
          data-testid="token-input"
        />
        <div className="flex justify-end mt-4 space-x-2">
          <button
            type="button"
            onClick={clearFields}
            className="bg-gray-300 text-gray-700 py-1 px-3 rounded hover:bg-gray-400 transition-colors duration-200 mb-4"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors duration-200 mb-4"
          >
            Confirmar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PaymentModal;
