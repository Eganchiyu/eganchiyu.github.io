const fs = require('fs');
const path = require('path');

const REPO_OWNER = 'Eganchiyu';
const REPO_NAME = 'eganchiyu.github.io';

async function fetchGraphQL(query, variables = {}) {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(`GraphQL error: ${JSON.stringify(data.errors)}`);
  }

  return data.data;
}

async function fetchDiscussions() {
  const query = `
    query($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        discussions(first: 100) {
          nodes {
            id
            title
            url
            reactions(first: 100) {
              totalCount
              nodes {
                content
              }
            }
            comments(first: 1) {
              totalCount
            }
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL(query, {
    owner: REPO_OWNER,
    name: REPO_NAME,
  });

  return data.repository.discussions.nodes;
}

function countReactions(reactions) {
  const counts = {};
  reactions.nodes.forEach(reaction => {
    counts[reaction.content] = (counts[reaction.content] || 0) + 1;
  });
  return {
    total: reactions.totalCount,
    ...counts,
  };
}

async function main() {
  try {
    console.log('Fetching discussions...');
    const discussions = await fetchDiscussions();

    const stats = {
      lastUpdated: new Date().toISOString(),
      posts: {},
      polls: {},
      global: {
        totalComments: 0,
        totalReactions: 0,
      },
    };

    discussions.forEach(discussion => {
      const title = discussion.title;

      // 统计评论数
      const commentCount = discussion.comments.totalCount;
      stats.global.totalComments += commentCount;

      // 统计 reactions
      const reactions = countReactions(discussion.reactions);
      stats.global.totalReactions += reactions.total;

      // 存储文章统计
      stats.posts[title] = {
        url: discussion.url,
        comments: commentCount,
        reactions: reactions,
      };
    });

    // 确保目录存在
    const dataDir = path.join(__dirname, '..', 'assets', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // 写入 JSON 文件
    const outputPath = path.join(dataDir, 'stats.json');
    fs.writeFileSync(outputPath, JSON.stringify(stats, null, 2));

    console.log(`Stats written to ${outputPath}`);
    console.log(`Total comments: ${stats.global.totalComments}`);
    console.log(`Total reactions: ${stats.global.totalReactions}`);
  } catch (error) {
    console.error('Error fetching stats:', error);
    process.exit(1);
  }
}

main();
