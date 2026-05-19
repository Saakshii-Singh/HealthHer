import CommunityPost from "../models/CommunityPost.js";

import {
  generateAnonymousName,
} from "../utils/generateAnonymousName.js";


// CREATE POST
export const createPost = async (req, res) => {
  try {
    const {
      title,
      content,
      mood,
      category,
    } = req.body;

    const post = await CommunityPost.create({
      anonymousName:
        generateAnonymousName(),

      title,
      content,
      mood,
      category,
    });

    res.status(201).json(post);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// GET POSTS
export const getPosts = async (req, res) => {
  try {

    const posts =
      await CommunityPost.find().sort({
        createdAt: -1,
      });

    res.status(200).json(posts);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};