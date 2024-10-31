import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios/axiosInstance';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { AiOutlineLike, AiFillLike, AiOutlineDislike, AiFillDislike } from 'react-icons/ai';
import ArticleModal from '../components/ArticleModal';
import BlockConfirmationModal from '../components/BlockConfirmationModal'; // Import the new modal
import { IArticle } from '../enum/ArticleCategory';
import Navbar from '../components/Navbar';

const Dashboard: React.FC = () => {
    const [articles, setArticles] = useState<IArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedArticle, setSelectedArticle] = useState<IArticle | null>(null);
    const [blockModalOpen, setBlockModalOpen] = useState(false); // State for the block confirmation modal
    const [articleToBlock, setArticleToBlock] = useState<string | null>(null); // ID of the article to block
    const user = useSelector((state: any) => state.user);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await axiosInstance.get('/articles');
                if (res.data.success) {
                    const visibleArticles = res.data.articles.filter(
                        (article: IArticle) => !article.blockedBy.includes(user.id)
                    );

                    const enhancedArticles = visibleArticles.map((article: { likes: any[]; dislikes: any[]; }) => ({
                        ...article,
                        hasLiked: article.likes.some(like => like.userId === user.id),
                        hasDisliked: article.dislikes.some(dislike => dislike.userId === user.id),
                    }));

                    setArticles(enhancedArticles);
                }
            } catch (error) {
                console.error(error);
                toast.error('Failed to load articles');
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [user.id]);

    const handleLike = async (articleId: string) => {
        try {
            const res = await axiosInstance.post('/articles/like', { articleId });
            if (res.data.success) {
                setArticles(prevArticles =>
                    prevArticles.map(article => {
                        if (article._id === articleId) {
                            const newHasLiked = !article.hasLiked;
                            return {
                                ...article,
                                likes: res.data.articleLikes,
                                hasLiked: newHasLiked,
                                hasDisliked: false,
                            };
                        }
                        return article;
                    })
                );
                toast.success(`Total Likes: ${res.data.likes}`);
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to like article');
        }
    };

    const handleDislike = async (articleId: string) => {
        try {
            const res = await axiosInstance.post('/articles/dislike', { articleId });
            if (res.data.success) {
                setArticles(prevArticles =>
                    prevArticles.map(article => {
                        if (article._id === articleId) {
                            const newHasDisliked = !article.hasDisliked;
                            return {
                                ...article,
                                dislikes: res.data.articleDislikes,
                                hasDisliked: newHasDisliked,
                            };
                        }
                        return article;
                    })
                );
                toast.success(`Total Dislikes: ${res.data.dislikes}`);
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to dislike article');
        }
    };

    const handleBlock = async (articleId: string) => {
        try {
            const res = await axiosInstance.post('/articles/block', { articleId });
            if (res.data.success) {
                setArticles(prevArticles => prevArticles.filter(article => article._id !== articleId));
                toast.success('Article blocked successfully');
                setBlockModalOpen(false); // Close the modal after blocking
                setArticleToBlock(null); // Reset articleToBlock
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to block article');
        }
    };

    const openModal = (article: IArticle) => {
        setSelectedArticle(article);
    };

    const closeModal = () => {
        setSelectedArticle(null);
    };

    const openBlockModal = (articleId: string) => {
        setArticleToBlock(articleId);
        setBlockModalOpen(true);
    };

    const closeBlockModal = () => {
        setBlockModalOpen(false);
        setArticleToBlock(null);
    };

    if (loading) {
        return <div className="text-center mt-10">Loading articles...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-900 to-gray-700">
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6 text-white text-center">Articles</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <div key={article._id} className="border rounded-lg p-4 shadow-md bg-gradient-to-r from-white via-gray-100 to-gray-200 hover:shadow-lg transition-shadow">
                            <img 
                                src={article.images[0]} 
                                alt={article.title} 
                                className="w-full h-48 object-cover rounded-t-lg mb-2" 
                            />
                            <h2 className="text-xl font-semibold cursor-pointer hover:text-blue-700 transition-colors" onClick={() => openModal(article)}>
                                {article.title}
                            </h2>
                            <p className="text-gray-700 mt-2">{article.description}</p>
                            <p className="text-sm text-gray-600 mt-2">By: {article.author.firstName} {article.author.lastName}</p>
                            <p className="text-sm text-gray-500 mt-1">Tags: {article.tags.join(', ')}</p>
                            <div className="flex justify-between mt-4">
                                <div className="flex items-center">
                                    <button 
                                        className="flex items-center text-blue-600 px-4 transition-colors hover:text-blue-800" 
                                        onClick={() => handleLike(article._id)}
                                    >
                                        {article.hasLiked ? (
                                            <AiFillLike className="text-blue-800" /> 
                                        ) : (
                                            <AiOutlineLike className="text-blue-600" /> 
                                        )}
                                        <span className="ml-1">{article.likes.length}</span>
                                    </button>
                                    <button 
                                        className={`flex items-center ${article.hasDisliked ? 'text-red-800 bg-red-100' : 'text-red-600'} transition-colors hover:text-red-800`} 
                                        onClick={() => {
                                            if (!article.hasLiked) {
                                                handleDislike(article._id);
                                            } else {
                                                toast.error("You must unlike the article before disliking it.");
                                            }
                                        }}
                                    >
                                        {article.hasDisliked ? (
                                            <AiFillDislike className="text-red-800" /> 
                                        ) : (
                                            <AiOutlineDislike className="mr-1" /> 
                                        )}
                                        <span className="ml-1">{article.dislikes.length}</span>
                                    </button>
                                </div>
                                <button 
                                    className="text-red-600 hover:text-red-800 transition-colors" 
                                    onClick={() => openBlockModal(article._id)}
                                >
                                    Block
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {selectedArticle && (
                <ArticleModal article={selectedArticle} onClose={closeModal} />
            )}
            <BlockConfirmationModal 
                isOpen={blockModalOpen} 
                onClose={closeBlockModal} 
                onConfirm={() => {
                    if (articleToBlock) {
                        handleBlock(articleToBlock);
                    }
                }} 
            />
        </div>
    );
};

export default Dashboard;
