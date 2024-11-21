import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTimeline, createPost, likePost, repost } from '../services/bluesky';
import { formatDistanceToNow } from 'date-fns';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [posting, setPosting] = useState(false);
  const { session, logout } = useAuth();

  useEffect(() => {
    fetchPosts();
    // Poll for new posts every 30 seconds
    const interval = setInterval(fetchPosts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await getTimeline();
      if (response.success) {
        setPosts(response.data);
      } else {
        setError('Failed to load posts');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || posting) return;

    setPosting(true);
    try {
      const response = await createPost(newPost);
      if (response.success) {
        setNewPost('');
        fetchPosts();
      } else {
        setError('Failed to create post');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (uri, cid) => {
    try {
      await likePost(uri, cid);
      fetchPosts();
    } catch (error) {
      console.error('Like failed:', error);
    }
  };

  const handleRepost = async (uri, cid) => {
    try {
      await repost(uri, cid);
      fetchPosts();
    } catch (error) {
      console.error('Repost failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading your timeline...
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleCreatePost}>
          <div className="form-group">
            <textarea
              className="input"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's happening?"
              style={{ minHeight: '100px', resize: 'vertical' }}
              maxLength={300}
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.5rem'
            }}>
              <small style={{ color: 'var(--gray)' }}>
                {newPost.length}/300 characters
              </small>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={posting || !newPost.trim()}
              >
                {posting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {error && (
        <div className="error" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div className="feed">
        {posts.map((post) => (
          <div key={post.post.uri} className="post">
            <div className="post-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {post.post.author.avatar && (
                  <img
                    src={post.post.author.avatar}
                    alt={post.post.author.handle}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                )}
                <div>
                  <div className="post-author">
                    {post.post.author.displayName || `@${post.post.author.handle}`}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray)' }}>
                    @{post.post.author.handle}
                  </div>
                </div>
              </div>
              <span className="post-time">
                {formatDistanceToNow(new Date(post.post.record.createdAt), { addSuffix: true })}
              </span>
            </div>
            <div className="post-content">
              {post.post.record.text}
            </div>
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginTop: '1rem',
              color: 'var(--gray)'
            }}>
              <button
                onClick={() => handleLike(post.post.uri, post.post.cid)}
                className="btn btn-secondary"
                style={{ 
                  color: post.post.viewer?.like ? 'var(--primary)' : 'inherit',
                  padding: '0.25rem 0.5rem'
                }}
              >
                ♥ {post.post.likeCount || '0'}
              </button>
              <button
                onClick={() => handleRepost(post.post.uri, post.post.cid)}
                className="btn btn-secondary"
                style={{ 
                  color: post.post.viewer?.repost ? 'var(--primary)' : 'inherit',
                  padding: '0.25rem 0.5rem'
                }}
              >
                ↺ {post.post.repostCount || '0'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;
