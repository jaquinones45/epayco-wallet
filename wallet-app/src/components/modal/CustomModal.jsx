import React from 'react';
import Modal from 'react-modal';

const CustomModal = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaHideApp={false}
      className="bg-white w-full max-w-md mx-auto my-4 p-6 rounded-lg shadow-lg"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-2xl mb-4">{title}</h2>
      {children}
    </Modal>
  );
};

export default CustomModal;
