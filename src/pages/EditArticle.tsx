import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios/axiosInstance';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { ArticleCategory, articleCategories } from '../enum/ArticleCategory';

const EditArticle: React.FC = () => {
    const { articleId } = useParams<{ articleId: string }>();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [category, setCategory] = useState<ArticleCategory | ''>('');
    const [image, setImage] = useState<File | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticleDetails = async () => {
            try {
                const res = await axiosInstance.get(`/articles/${articleId}`);
                if (res.data.success) {
                    const { title, description, tags, category } = res.data.article;
                    setTitle(title);
                    setDescription(description);
                    setTags(tags.join(', ')); // Assuming tags are stored as an array
                    setCategory(category);
                }
            } catch (error) {
                console.error(error);
                toast.error('Failed to load article details');
            }
        };

        fetchArticleDetails();
    }, [articleId]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('tags', tags);
        formData.append('category', category);
        if (image) {
            formData.append('image', image);
        }

        try {
            const res = await axiosInstance.put(`/articles/${articleId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data.success) {
                toast.success('Article updated successfully!');
                navigate('/my-articles'); // Redirect to articles list
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update article');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Article</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        rows={4}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Tags (comma separated)</label>
                    <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                        className="w-full border rounded px-3 py-2"
                        required
                    >
                        <option value="">Select a category</option>
                        {articleCategories.map((cat:any) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Image</label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Update Article
                </button>
            </form>
        </div>
    );
};

export default EditArticle;
