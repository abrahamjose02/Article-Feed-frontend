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
            <div className="bg-white p-6 rounded shadow-md w-96 relative overflow-y-auto max-h-[80vh]">
                <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>
                    <AiOutlineClose />
                </button>
                <img src={article.images} alt={article.title} className="w-full h-48 object-cover rounded" />
                <h2 className="text-xl font-bold mt-4">{article.title}</h2>
                <p className="mt-2">{article.description}</p>
                <p className="text-sm text-gray-600 mt-2">By: {article.author.firstName} {article.author.lastName}</p>
                <p className="text-sm text-gray-500 mt-2">Tags: {article.tags.join(', ')}</p>
                <div className="mt-4">
                    <h3 className="font-semibold">Likes: {article.likes.length}</h3>
                    <h3 className="font-semibold">Dislikes: {article.dislikes.length}</h3>
                    <h3 className="font-semibold">Blocked By: {article.blocks}</h3>
                </div>
                <div className="mt-4">
                    <h3 className="font-semibold">Content:</h3>
                    <div className="mt-2" dangerouslySetInnerHTML={{ __html: article.content }} />
                </div>
            </div>
        </div>
    );
};

export default ArticleModal;
