import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function Community() {
  const [posts, setPosts] = useState([]);

  const [form, setForm] = useState({
    title: "",
    content: "",
    mood: "",
    category: "",
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  // FETCH POSTS
  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/community/posts"
      );

      setPosts(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  // CREATE POST
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:5000/api/community/create",
        form
      );

      fetchPosts();

      setForm({
        title: "",
        content: "",
        mood: "",
        category: "",
      });

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-pink-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >

      {/* HEADING */}
      <motion.h1
        className="text-4xl font-bold text-pink-600 mb-2"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        💜 HealthHer Community
      </motion.h1>

      <p className="text-gray-600 mb-8">
        Share your thoughts safely and anonymously.
      </p>

      {/* FORM */}
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md space-y-4"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >

        {/* TITLE */}
        <input
          type="text"
          placeholder="Enter title..."
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
          className="w-full border border-pink-200 p-3 rounded-lg outline-none focus:border-pink-500"
        />

        {/* CONTENT */}
        <textarea
          placeholder="Share your feelings..."
          value={form.content}
          onChange={(e) =>
            setForm({
              ...form,
              content: e.target.value,
            })
          }
          className="w-full border border-pink-200 p-3 rounded-lg outline-none focus:border-pink-500 h-32"
        />

        {/* MOOD */}
        <select
          value={form.mood}
          onChange={(e) =>
            setForm({
              ...form,
              mood: e.target.value,
            })
          }
          className="w-full border border-pink-200 p-3 rounded-lg outline-none focus:border-pink-500"
        >
          <option value="">Select Mood</option>
          <option value=" Happy">😊 Happy</option>
          <option value=" Sad">😢 Sad</option>
          <option value=" Anxious">😰 Anxious</option>
          <option value=" Angry">😡 Angry</option>
          <option value=" Lonely">😔 Lonely</option>
        </select>

        {/* CATEGORY */}
        <select
          value={form.category}
          onChange={(e) =>
            setForm({
              ...form,
              category: e.target.value,
            })
          }
          className="w-full border border-pink-200 p-3 rounded-lg outline-none focus:border-pink-500"
        >
          <option value="">Select Category</option>
          <option value="Periods">Periods</option>
          <option value="Mental Health">
            Mental Health
          </option>
          <option value="Stress">Stress</option>
          <option value="PCOS">PCOS</option>
          <option value="Relationships">
            Relationships
          </option>
        </select>

        {/* BUTTON */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md"
        >
          Post Anonymously
        </motion.button>
      </motion.form>

      {/* POSTS */}
      <div className="mt-10 space-y-5">

        {posts.map((post) => (

          <motion.div
            key={post._id}
            className="bg-white p-5 rounded-2xl shadow-md"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{
              scale: 1.02,
            }}
          >

            {/* TITLE */}
            <h2 className="text-2xl font-bold text-pink-600">
              {post.title}
            </h2>

            {/* CONTENT */}
            <p className="text-gray-700 mt-3">
              {post.content}
            </p>

            {/* TAGS */}
            <div className="flex gap-3 mt-4">

              <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm">
                {post.mood}
              </span>

              <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                {post.category}
              </span>

            </div>

            {/* FOOTER */}
            <div className="flex justify-between items-center mt-5">

              <p className="text-sm text-gray-500">
                👤 {post.anonymousName}
              </p>

              <motion.button
                whileTap={{ scale: 0.9 }}
                className="text-pink-500"
              >
                 Like
              </motion.button>

            </div>

          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Community;