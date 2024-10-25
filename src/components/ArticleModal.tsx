// src/components/ArticleModal.tsx
import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface ArticleModalProps {
    article: any;
    onClose: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
    if (!article) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-md w-96 relative">
                <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>
                    <AiOutlineClose />
                </button>
                <h2 className="text-xl font-bold">{article.title}</h2>
                <p className="mt-2">{article.description}</p>
                <p className="text-sm text-gray-600 mt-2">By: {article.author.firstName} {article.author.lastName}</p>
                <div className="mt-4">
                    <h3 className="font-semibold">Likes: {article.likes.length}</h3>
                    <h3 className="font-semibold">Dislikes: {article.dislikes.length}</h3>
                    <h3 className="font-semibold">Blocked By: {article.blocks}</h3>
                </div>
            </div>
        </div>
    );
};

export default ArticleModal;
