import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios/axiosInstance';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import Navbar from '../components/Navbar';
import ArticleModal from '../components/MyArticleModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const ArticleList: React.FC = () => {
    const [articles, setArticles] = useState<any[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserArticles = async () => {
            try {
                const res = await axiosInstance.get('/articles/user');
                if (res.data.success) {
                    setArticles(res.data.articles);
                }
            } catch (error) {
                console.error(error);
                toast.error('Failed to load articles');
            }
        };

        fetchUserArticles();
    }, []);

    const handleDelete = async () => {
        if (!articleToDelete) return;

        try {
            const res = await axiosInstance.delete(`/articles/${articleToDelete}`);
            if (res.data.success) {
                setArticles(articles.filter(article => article._id !== articleToDelete));
                toast.success('Article deleted successfully');
                setIsDeleteModalOpen(false);
                setArticleToDelete(null); // Clear the article to delete
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete article');
        }
    };

    const openDeleteModal = (articleId: string) => {
        setArticleToDelete(articleId);
        setIsDeleteModalOpen(true);
    };

    const handleEdit = (articleId: string) => {
        navigate(`/edit-article/${articleId}`);
    };

    const handleViewDetails = (article: any) => {
        setSelectedArticle(article);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedArticle(null);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setArticleToDelete(null);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900">
            <Navbar />
            <div className="container mx-auto p-4 flex-grow flex items-center justify-center">
                <div className="bg-gradient-to-br from-gray-200 to-gray-300 p-6 rounded-lg shadow-md w-full">
                    <h1 className="text-2xl font-bold mb-4">My Articles</h1>
                    {articles.length === 0 ? (
                        <div>No articles found.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {articles.map(article => (
                                <div key={article._id} className="border rounded-lg p-4 shadow-md bg-white transition-transform transform hover:scale-105">
                                    {article.images.length > 0 && (
                                        <img
                                            src={article.images[0]} 
                                            alt={article.title}
                                            className="w-full h-32 object-cover rounded-t-lg cursor-pointer"
                                            onClick={() => handleViewDetails(article)} // Open modal on image click
                                        />
                                    )}
                                    <h2 className="text-lg font-semibold mt-2">{article.title}</h2>
                                    <p className="text-gray-600 text-sm mt-1">{article.description}</p>
                                    <div className="flex justify-between mt-2">
                                        <button className="text-blue-600" onClick={() => handleEdit(article._id)}>
                                            <AiOutlineEdit className="mr-1" />
                                        </button>
                                        <button className="text-red-600" onClick={() => openDeleteModal(article._id)}>
                                            <AiOutlineDelete className="mr-1" /> 
                                        </button>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500">
                                        <p>Likes: {article.likes.length}</p>
                                        <p>Dislikes: {article.dislikes.length}</p>
                                        <p>Blocked: {article.blocks}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* Modal for article details */}
            <ArticleModal article={selectedArticle} isOpen={isModalOpen} onClose={closeModal} />

            {/* Modal for delete confirmation */}
            <DeleteConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default ArticleList;
