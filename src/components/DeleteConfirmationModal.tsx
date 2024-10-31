import React from 'react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-sm w-full">
                <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                <p className="mb-4">Are you sure you want to delete this article? This action cannot be undone.</p>
                <div className="flex justify-end">
                    <button 
                        className="mr-2 bg-gray-300 text-gray-800 rounded-full px-4 py-2 transition hover:bg-gray-400" 
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button 
                        className="bg-red-600 text-white rounded-full px-4 py-2 transition hover:bg-red-700" 
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
