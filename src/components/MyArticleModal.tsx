import React from 'react';

interface ArticleModalProps {
    article: any; 
    isOpen: boolean;
    onClose: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, isOpen, onClose }) => {
    if (!isOpen || !article) return null; 

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-[90vh] overflow-y-auto">
               
                <h2 className="text-2xl font-bold mb-2 text-blue-600 border-b pb-2">{article.title}</h2>
                
               
                {article.images.length > 0 && (
                    <img src={article.images[0]} alt={article.title} className="w-full h-40 object-cover rounded mb-4" />
                )}

               
                <div className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: formatContent(article.content) }} />

                
                {article.tags && article.tags.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Tags:</h3>
                        <div className="flex flex-wrap gap-2">
                            {article.tags.map((tag: string) => (
                                <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                
                <div className="mt-4 text-gray-500">
                    <p>Likes: {article.likes.length}</p>
                    <p>Dislikes: {article.dislikes.length}</p>
                    <p>Blocked: {article.blocks}</p>
                </div>

                {/* Close Button */}
                <button className="mt-4 text-red-600 hover:text-red-800 transition" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

// Function to format content into paragraphs and bullet points
const formatContent = (content: string) => {
    // Split the content by new lines and bullet points
    const paragraphs = content.split('\n\n').map(paragraph => `<p>${paragraph.trim()}</p>`).join('');
    return paragraphs;
};

export default ArticleModal;
