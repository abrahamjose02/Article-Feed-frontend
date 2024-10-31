import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios/axiosInstance';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { ArticleCategory, articleCategories } from '../enum/ArticleCategory';
import Navbar from '../components/Navbar';

const EditArticle: React.FC = () => {
    const { articleId } = useParams<{ articleId: string }>();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [category, setCategory] = useState<ArticleCategory | ''>('');
    const [existingImage, setExistingImage] = useState<string | null>(null);
    const [newImage, setNewImage] = useState<File | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticleDetails = async () => {
            try {
                const res = await axiosInstance.get(`/articles/${articleId}`);
                if (res.data.success) {
                    const { title, description, content, tags, category, images } = res.data.article;
                    setTitle(title);
                    setDescription(description);
                    setContent(content);
                    setTags(tags.join(', '));
                    setCategory(category);
                    setExistingImage(images[0] || null);
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
            setNewImage(e.target.files[0]);
            setExistingImage(null); 
        }
    };

    const handleRemoveImage = () => {
        setNewImage(null);
        setExistingImage(null); 
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!title) newErrors.title = 'Title is required.';
        if (!description) newErrors.description = 'Description is required.';
        if (!content) newErrors.content = 'Content is required.';
        if (!tags) newErrors.tags = 'Tags are required.';
        if (!category) newErrors.category = 'Category is required.';
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const formattedContent = formatContent(content);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('content', formattedContent);
        formData.append('tags', tags);
        formData.append('category', category);
        if (newImage) {
            formData.append('image', newImage);
        } else if (existingImage) {
            formData.append('removeImage', 'false');
        } else {
            formData.append('removeImage', 'true');
        }

        try {
            const res = await axiosInstance.put(`/articles/${articleId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data.success) {
                toast.success('Article updated successfully!');
                navigate('/my-articles');
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update article');
        }
    };

    const formatContent = (content: string) => {
        const paragraphs = content.split('\n\n').map(paragraph => `<p class="mb-4">${paragraph.trim()}</p>`).join('');
        const bulletPoints = paragraphs.split('\n').filter(point => point.trim() !== '').map(point => `<li class="mb-2">${point.trim()}</li>`).join('');
        return `<ul class="list-disc pl-6">${bulletPoints}</ul>`;
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900">
            <Navbar />
            <div className="container mx-auto p-4 flex-grow flex items-center justify-center">
                <div className="bg-gradient-to-br from-gray-200 to-gray-300 p-6 rounded-lg shadow-md w-full max-w-lg">
                    <h1 className="text-2xl font-bold mb-4">Edit Article</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title Input */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    setErrors((prev) => ({ ...prev, title: '' }));
                                }}
                                className={`w-full border rounded px-3 py-2 ${errors.title ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.title && <span className="text-red-500">{errors.title}</span>}
                        </div>

                        {/* Description Input */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    setErrors((prev) => ({ ...prev, description: '' }));
                                }}
                                className={`w-full border rounded px-3 py-2 ${errors.description ? 'border-red-500' : ''}`}
                                rows={2}
                                required
                            />
                            {errors.description && <span className="text-red-500">{errors.description}</span>}
                        </div>

                        {/* Content Input */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => {
                                    setContent(e.target.value);
                                    setErrors((prev) => ({ ...prev, content: '' }));
                                }}
                                className={`w-full border rounded px-3 py-2 ${errors.content ? 'border-red-500' : ''}`}
                                rows={6}
                                required
                            />
                            {errors.content && <span className="text-red-500">{errors.content}</span>}
                        </div>

                        {/* Tags Input */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Tags (comma separated)</label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => {
                                    setTags(e.target.value);
                                    setErrors((prev) => ({ ...prev, tags: '' }));
                                }}
                                className={`w-full border rounded px-3 py-2 ${errors.tags ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.tags && <span className="text-red-500">{errors.tags}</span>}
                        </div>

                        {/* Category Dropdown */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Category</label>
                            <select
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value as ArticleCategory);
                                    setErrors((prev) => ({ ...prev, category: '' }));
                                }}
                                className={`w-full border rounded px-3 py-2 ${errors.category ? 'border-red-500' : ''}`}
                                required
                            >
                                <option value="">Select a category</option>
                                {articleCategories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                            {errors.category && <span className="text-red-500">{errors.category}</span>}
                        </div>

                        {/* Image Upload */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Image</label>
                            {existingImage || newImage ? (
                                <div className="relative max-w-xs max-h-48 mb-2 overflow-hidden rounded-lg shadow-lg">
                                    <img
                                        src={existingImage || URL.createObjectURL(newImage!)}
                                        alt="Article Preview"
                                        className="object-contain w-full h-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="border rounded px-3 py-2"
                                />
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                        >
                            Update Article
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditArticle;
