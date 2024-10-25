// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios/axiosInstance';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { AiOutlineLike, AiOutlineDislike} from 'react-icons/ai';
import ArticleModal from '../components/ArticleModal';
import { IArticle } from '../enum/ArticleCategory'; 

const Dashboard: React.FC = () => {
    const [articles, setArticles] = useState<IArticle[]>([]); 
    const [loading, setLoading] = useState(true);
    const [selectedArticle, setSelectedArticle] = useState<IArticle | null>(null); 
    const user = useSelector((state: any) => state.user);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await axiosInstance.get('/articles'); 
                if (res.data.success) {
                    setArticles(res.data.articles);
                }
            } catch (error) {
                console.error(error);
                toast.error('Failed to load articles');
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const handleLike = async (articleId: string) => {
        try {
            const res = await axiosInstance.post('/articles/like', { articleId });
            if (res.data.success) {
                setArticles(prevArticles =>
                    prevArticles.map(article =>
                        article._id === articleId
                            ? { ...article, likes: [...article.likes, { userId: user.id }] }
                            : article
                    )
                );
                toast.success(`Liked article! Total Likes: ${res.data.likes}`);
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
                    prevArticles.map(article =>
                        article._id === articleId
                            ? { ...article, dislikes: [...article.dislikes, { userId: user.id }] }
                            : article
                    )
                );
                toast.success(`Disliked article! Total Dislikes: ${res.data.dislikes}`);
            }
        } catch (error:any) {
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
            }
        } catch (error:any) {
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

    if (loading) {
        return <div className="text-center mt-10">Loading articles...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Articles</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                    <div key={article._id} className="border rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition-shadow">
                        <h2 className="text-xl font-semibold cursor-pointer" onClick={() => openModal(article)}>
                            {article.title}
                        </h2>
                        <p className="text-gray-700 mt-2">{article.description}</p>
                        <p className="text-sm text-gray-600 mt-2">By: {article.author.firstName} {article.author.lastName}</p>
                        <div className="flex justify-between mt-4">
                            <div className="flex items-center">
                                <button className="flex items-center text-blue-600" onClick={() => handleLike(article._id)}>
                                    <AiOutlineLike className="mr-1" /> {article.likes.length}
                                </button>
                                <button className="flex items-center text-red-600 ml-4" onClick={() => handleDislike(article._id)}>
                                    <AiOutlineDislike className="mr-1" /> {article.dislikes.length}
                                </button>
                            </div>
                            <button className="bg-gray-500 text-white py-1 px-2 rounded" onClick={() => handleBlock(article._id)}>
                                Block
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {selectedArticle && <ArticleModal article={selectedArticle} onClose={closeModal} />}
        </div>
    );
};

export default Dashboard;
