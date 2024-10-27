import mongoose from 'mongoose';

export enum ArticleCategory {
    TECHNOLOGY = "Technology",
    HEALTH = "Health",
    EDUCATION = "Education",
    LIFESTYLE = "Lifestyle",
    FINANCE = "Finance",
    TRAVEL = "Travel",
    FOOD = "Food",
    SPORTS = "Sports",
    ENTERTAINMENT = "Entertainment",
    SCIENCE = "Science"
}

export const articleCategories = Object.values(ArticleCategory);


export interface IArticle {
    hasDisliked: any;
    hasLiked: any;
    _id: string;
    title: string;
    description: string;
    images: string[];
    tags: string[];
    category: ArticleCategory;
    author: {
        firstName: string;
        lastName: string;
    };
    likes: { userId: mongoose.Types.ObjectId }[];
    dislikes: { userId: mongoose.Types.ObjectId}[];
    blocks: number;
    blockedBy: mongoose.Types.ObjectId[];
}