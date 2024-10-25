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


export interface IArticle {
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
    likes: { userId: string }[];
    dislikes: { userId: string }[];
    blocks: number;
    blockedBy: mongoose.Types.ObjectId[];
}