import React, { useState } from 'react';
import axiosInstance from '../axios/axiosInstance';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ArticleCategory, articleCategories } from '../enum/ArticleCategory'; // Import the enum
import Navbar from '../components/Navbar';

const CreateArticle: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [category, setCategory] = useState<ArticleCategory | ''>('');
    const [image, setImage] = useState<File | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0]);
        }
    };

    // Validation function
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        
        if (!title) newErrors.title = 'Title is required.';
        if (!description) newErrors.description = 'Description is required.';
        if (!content) newErrors.content = 'Content is required.';
        if (!tags) newErrors.tags = 'Tags are required.';
        if (!category) newErrors.category = 'Category is required.';
        if (!image) newErrors.image = 'Image is required.';

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; // Prevent submission if there are errors
        }

        // Format the content with paragraphs and bullet points
        const formattedContent = formatContent(content);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('content', formattedContent);
        formData.append('tags', tags);
        formData.append('category', category);
        if (image) {
            formData.append('image', image);
        }

        try {
            const res = await axiosInstance.post('/articles/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data.success) {
                toast.success('Article created successfully!');
                navigate('/my-articles'); 
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to create article');
        }
    };

    // Function to format content into paragraphs and bullet points
    const formatContent = (content: string) => {
        // Convert line breaks into paragraph tags and split content into bullet points
        const paragraphs = content.split('\n\n').map(paragraph => `<p class="mb-4">${paragraph.trim()}</p>`).join('');
        const bulletPoints = paragraphs.split('\n').filter(point => point.trim() !== '').map(point => `<li class="mb-2">${point.trim()}</li>`).join('');
        return `<ul class="list-disc pl-6">${bulletPoints}</ul>`;
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="container mx-auto p-4 flex-grow flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
                    <h1 className="text-2xl font-bold mb-4">Create Article</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    setErrors((prev) => ({ ...prev, title: '' })); // Clear error
                                }}
                                className={`w-full border rounded px-3 py-2 ${errors.title ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.title && <span className="text-red-500">{errors.title}</span>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    setErrors((prev) => ({ ...prev, description: '' })); // Clear error
                                }}
                                className={`w-full border rounded px-3 py-2 ${errors.description ? 'border-red-500' : ''}`}
                                rows={2} // Set smaller height
                                required
                            />
                            {errors.description && <span className="text-red-500">{errors.description}</span>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => {
                                    setContent(e.target.value);
                                    setErrors((prev) => ({ ...prev, content: '' })); // Clear error
                                }}
                                className={`w-full border rounded px-3 py-2 ${errors.content ? 'border-red-500' : ''}`}
                                rows={6} // Set larger height
                                required
                            />
                            {errors.content && <span className="text-red-500">{errors.content}</span>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Tags (comma separated)</label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => {
                                    setTags(e.target.value);
                                    setErrors((prev) => ({ ...prev, tags: '' })); // Clear error
                                }}
                                className={`w-full border rounded px-3 py-2 ${errors.tags ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.tags && <span className="text-red-500">{errors.tags}</span>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Category</label>
                            <select
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value as ArticleCategory);
                                    setErrors((prev) => ({ ...prev, category: '' })); // Clear error
                                }}
                                className={`w-full border rounded px-3 py-2 ${errors.category ? 'border-red-500' : ''}`}
                                required
                            >
                                <option value="">Select a category</option>
                                {articleCategories.map((cat: any) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                            {errors.category && <span className="text-red-500">{errors.category}</span>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Image</label>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                className={`w-full border rounded px-3 py-2 ${errors.image ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.image && <span className="text-red-500">{errors.image}</span>}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                        >
                            Create Article
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateArticle;
