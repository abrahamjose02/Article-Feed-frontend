import React, { useState } from 'react';
import axiosInstance from '../axios/axiosInstance';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ArticleCategory, articleCategories } from '../enum/ArticleCategory';
import Navbar from '../components/Navbar';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';


const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required.'),
    description: Yup.string().required('Description is required.'),
    content: Yup.string().required('Content is required.'),
    tags: Yup.string().required('Tags are required.'),
    category: Yup.string().required('Category is required.'),
    image: Yup.mixed().required('Image is required.')
});

const CreateArticle: React.FC = () => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const navigate = useNavigate();

    
    const formatContent = (content: string) => {
        const paragraphs = content
            .split('\n\n')
            .map((paragraph) => `<p class="mb-4">${paragraph.trim()}</p>`)
            .join('');
        const bulletPoints = paragraphs
            .split('\n')
            .filter((point) => point.trim() !== '')
            .map((point) => `<li class="mb-2">${point.trim()}</li>`)
            .join('');
        return `<ul class="list-disc pl-6">${bulletPoints}</ul>`;
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="container mx-auto p-4 flex-grow flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
                    <h1 className="text-2xl font-bold mb-4">Create Article</h1>
                    <Formik
                        initialValues={{
                            title: '',
                            description: '',
                            content: '',
                            tags: '',
                            category: '',
                            image: null
                        }}
                        validationSchema={validationSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            const formattedContent = formatContent(values.content);

                            const formData = new FormData();
                            formData.append('title', values.title);
                            formData.append('description', values.description);
                            formData.append('content', formattedContent);
                            formData.append('tags', values.tags);
                            formData.append('category', values.category);
                            if (values.image) {
                                formData.append('image', values.image);
                            }

                            try {
                                const res = await axiosInstance.post('/articles/create', formData, {
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }
                                });

                                if (res.data.success) {
                                    toast.success('Article created successfully!');
                                    navigate('/my-articles');
                                }
                            } catch (error: any) {
                                console.error(error);
                                toast.error(error.response?.data?.message || 'Failed to create article');
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ setFieldValue, isSubmitting }) => (
                            <Form className="space-y-4">
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Title</label>
                                    <Field
                                        name="title"
                                        type="text"
                                        className="w-full border rounded px-3 py-2"
                                    />
                                    <ErrorMessage name="title" component="span" className="text-red-500" />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Description</label>
                                    <Field
                                        name="description"
                                        as="textarea"
                                        rows={2}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                    <ErrorMessage name="description" component="span" className="text-red-500" />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Content</label>
                                    <Field
                                        name="content"
                                        as="textarea"
                                        rows={6}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                    <ErrorMessage name="content" component="span" className="text-red-500" />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Tags (comma separated)</label>
                                    <Field
                                        name="tags"
                                        type="text"
                                        className="w-full border rounded px-3 py-2"
                                    />
                                    <ErrorMessage name="tags" component="span" className="text-red-500" />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Category</label>
                                    <Field as="select" name="category" className="w-full border rounded px-3 py-2">
                                        <option value="">Select a category</option>
                                        {articleCategories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="category" component="span" className="text-red-500" />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Image</label>
                                    <input
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.currentTarget.files?.[0];
                                            setFieldValue('image', file || null);
                                            if (file) {
                                                setImagePreview(URL.createObjectURL(file));
                                            } else {
                                                setImagePreview(null);
                                            }
                                        }}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                    <ErrorMessage name="image" component="span" className="text-red-500" />
                                    {imagePreview && (
                                        <div className="mt-4">
                                            <img src={imagePreview} alt="Preview" className="w-full h-auto mb-2" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFieldValue('image', null);
                                                    setImagePreview(null);
                                                }}
                                                className=" top-1 right-1 bg-red-500 text-white p-1 rounded"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Article'}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default CreateArticle;
