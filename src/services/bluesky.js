import { BskyAgent } from '@atproto/api';

const agent = new BskyAgent({
  service: 'https://bsky.social'
});

export const loginWithBluesky = async (identifier, password) => {
  try {
    const formattedIdentifier = identifier.includes('@') ? 
      identifier : 
      (identifier.includes('.') ? identifier : `${identifier}.bsky.social`);

    const response = await agent.login({
      identifier: formattedIdentifier,
      password
    });

    if (response.success) {
      await agent.resumeSession(response.data);
    }

    return {
      success: true,
      data: response.data,
      token: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.message || 'Invalid credentials'
    };
  }
};

export const getTimeline = async () => {
  try {
    const response = await agent.getTimeline({
      limit: 50
    });
    return {
      success: true,
      data: response.data.feed
    };
  } catch (error) {
    console.error('Timeline error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const createPost = async (text) => {
  try {
    const response = await agent.post({
      text: text,
      createdAt: new Date().toISOString()
    });
    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('Post creation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const searchUsers = async (term) => {
  try {
    const response = await agent.searchActors({
      term,
      limit: 10
    });
    return {
      success: true,
      data: response.data.actors
    };
  } catch (error) {
    console.error('User search error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const getProfile = async (actor) => {
  try {
    const response = await agent.getProfile({ actor });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Profile fetch error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const followUser = async (did) => {
  try {
    const response = await agent.follow(did);
    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('Follow error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const unfollowUser = async (did) => {
  try {
    const response = await agent.deleteFollow(did);
    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('Unfollow error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const likePost = async (uri, cid) => {
  try {
    const response = await agent.like(uri, cid);
    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('Like error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const unlikePost = async (uri) => {
  try {
    const response = await agent.deleteLike(uri);
    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('Unlike error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const repost = async (uri, cid) => {
  try {
    const response = await agent.repost(uri, cid);
    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('Repost error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const unrepost = async (uri) => {
  try {
    const response = await agent.deleteRepost(uri);
    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('Unrepost error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const getPostThread = async (uri) => {
  try {
    const response = await agent.getPostThread({ uri });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Thread fetch error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const getFollowers = async (actor) => {
  try {
    const response = await agent.getFollowers({ actor });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Followers fetch error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const getFollowing = async (actor) => {
  try {
    const response = await agent.getFollows({ actor });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Following fetch error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const getMutes = async () => {
  try {
    const response = await agent.getMutes();
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Mutes fetch error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const muteUser = async (actor) => {
  try {
    const response = await agent.mute(actor);
    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('Mute error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const unmuteUser = async (actor) => {
  try {
    const response = await agent.unmute(actor);
    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('Unmute error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
