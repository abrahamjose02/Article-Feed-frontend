import React from 'react';

interface BlockConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const BlockConfirmationModal: React.FC<BlockConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-sm w-full">
                <h2 className="text-lg font-bold mb-4">Confirm Block</h2>
                <p className="mb-4">Are you sure you want to block this article? This action cannot be undone.</p>
                <div className="flex justify-end space-x-2">
                    <button 
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors" 
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button 
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors" 
                        onClick={onConfirm}
                    >
                        Block
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlockConfirmationModal;
