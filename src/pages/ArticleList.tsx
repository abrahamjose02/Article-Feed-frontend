import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios/axiosInstance';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import Navbar from '../components/Navbar';
import ArticleModal from '../components/MyArticleModal';

const ArticleList: React.FC = () => {
    const [articles, setArticles] = useState<any[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const handleDelete = async (articleId: string) => {
        try {
            const res = await axiosInstance.delete(`/articles/${articleId}`);
            if (res.data.success) {
                setArticles(articles.filter(article => article._id !== articleId));
                toast.success('Article deleted successfully');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete article');
        }
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

    return (
        <div>
            <Navbar />
            <div className="container mx-auto p-4">
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
                                        <AiOutlineEdit className="mr-1" /> Edit
                                    </button>
                                    <button className="text-red-600" onClick={() => handleDelete(article._id)}>
                                        <AiOutlineDelete className="mr-1" /> Delete
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
            {/* Modal for article details */}
            <ArticleModal article={selectedArticle} isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
};

export default ArticleList;
