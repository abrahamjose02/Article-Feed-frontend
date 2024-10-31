import React, { useState } from 'react';
import axiosInstance from '../axios/axiosInstance';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { articleCategories } from '../enum/ArticleCategory';
import Navbar from '../components/Navbar';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Spinner from '../components/Spinner';  // Import Spinner component

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
    return `<ul class="list-disc pl-6">${paragraphs}</ul>`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900">
      <Navbar />
      <div className="container mx-auto p-4 flex-grow flex items-center justify-center">
        <div className="bg-gradient-to-br from-gray-200 to-gray-300 p-6 rounded-lg shadow-lg w-full max-w-lg">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Create Article</h1>
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
              // Start submission
              const formattedContent = formatContent(values.content);
              const formData = new FormData();
              formData.append('title', values.title);
              formData.append('description', values.description);
              formData.append('content', formattedContent);
              formData.append('tags', values.tags);
              formData.append('category', values.category);
              if (values.image) formData.append('image', values.image);
              try {
                const res = await axiosInstance.post('/articles/create', formData);
                if (res.data.success) {
                  toast.success('Article created successfully!');
                  navigate('/my-articles');
                }
              } catch (error: any) {
                toast.error(error.response?.data?.message || 'Failed to create article');
              } finally {
                // Reset submitting state
                setSubmitting(false);
              }
            }}
          >
            {({ setFieldValue, isSubmitting }) => (
              <Form className="space-y-5">
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1 font-semibold">Title</label>
                  <Field
                    name="title"
                    type="text"
                    className="w-full border rounded px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-200 focus:outline-none"
                  />
                  <ErrorMessage name="title" component="span" className="text-red-500 text-sm" />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-1 font-semibold">Description</label>
                  <Field
                    name="description"
                    as="textarea"
                    rows={2}
                    className="w-full border rounded px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-200 focus:outline-none"
                  />
                  <ErrorMessage name="description" component="span" className="text-red-500 text-sm" />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-1 font-semibold">Content</label>
                  <Field
                    name="content"
                    as="textarea"
                    rows={5}
                    className="w-full border rounded px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-200 focus:outline-none"
                  />
                  <ErrorMessage name="content" component="span" className="text-red-500 text-sm" />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-1 font-semibold">Tags (comma separated)</label>
                  <Field
                    name="tags"
                    type="text"
                    className="w-full border rounded px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-200 focus:outline-none"
                  />
                  <ErrorMessage name="tags" component="span" className="text-red-500 text-sm" />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-1 font-semibold">Category</label>
                  <Field as="select" name="category" className="w-full border rounded px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-200 focus:outline-none">
                    <option value="">Select a category</option>
                    {articleCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="category" component="span" className="text-red-500 text-sm" />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-1 font-semibold">Image</label>
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
                    className="w-full border rounded px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-200 focus:outline-none"
                  />
                  <ErrorMessage name="image" component="span" className="text-red-500 text-sm" />
                  {imagePreview && (
                    <div className="mt-4">
                      <img src={imagePreview} alt="Preview" className="w-full h-auto mb-2 rounded-md" />
                      <button
                        type="button"
                        onClick={() => {
                          setFieldValue('image', null);
                          setImagePreview(null);
                        }}
                        className="top-1 right-1 bg-red-500 text-white p-1 rounded mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="w-full py-2 flex justify-center">
                  {isSubmitting ? <Spinner /> : (
                    <button
                      type="submit"
                      className="w-full py-2 rounded text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all"
                      disabled={isSubmitting}  // Disable button during submission
                    >
                      Create Article
                    </button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;
