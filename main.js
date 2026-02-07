// GitHub API integration for Recent Work section
// Repository data is now in config.js (CONFIG.githubRepos)

async function fetchGitHubRepoData(owner, repo) {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    const data = await response.json();
    return {
      name: data.name,
      description: data.description,
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language,
      topics: data.topics || [],
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error(`Error fetching data for ${owner}/${repo}:`, error);
    return null;
  }
}

function showLoadingState(cardElement) {
  const descriptionEl = cardElement.querySelector('.project-description');
  const techStackEl = cardElement.querySelector('.tech-stack');

  if (descriptionEl) {
    descriptionEl.innerHTML = '<span class="loading-text">Loading project data...</span>';
  }
  if (techStackEl) {
    techStackEl.innerHTML = '';
  }
}

function showErrorState(cardElement) {
  const descriptionEl = cardElement.querySelector('.project-description');
  const techStackEl = cardElement.querySelector('.tech-stack');

  if (descriptionEl) {
    descriptionEl.innerHTML = '<span class="error-text">⚠️ Failed to load project data from GitHub. Please try refreshing the page.</span>';
  }
  if (techStackEl) {
    techStackEl.innerHTML = '';
  }
}

function updateProjectCard(cardElement, repoData, customTags = [], githubUrl = '', liveDemo = null) {
  if (!repoData) {
    showErrorState(cardElement);
    return;
  }

  // Update description
  const descriptionEl = cardElement.querySelector('.project-description');
  if (descriptionEl) {
    descriptionEl.textContent = repoData.description || 'No description available';
  }

  // Update tech stack with language + custom tags
  const techStackEl = cardElement.querySelector('.tech-stack');
  if (techStackEl) {
    techStackEl.innerHTML = '';

    // Add primary language first
    if (repoData.language) {
      const langTag = document.createElement('span');
      langTag.className = 'tech-tag';
      langTag.textContent = repoData.language;
      techStackEl.appendChild(langTag);
    }

    // Add custom tags
    if (customTags && customTags.length > 0) {
      customTags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tech-tag';
        tagElement.textContent = tag;
        techStackEl.appendChild(tagElement);
      });
    }
  }

  // Add/update stars count
  const headerEl = cardElement.querySelector('.project-card-header');
  if (headerEl) {
    let starsEl = cardElement.querySelector('.github-stars');
    if (!starsEl) {
      starsEl = document.createElement('span');
      starsEl.className = 'github-stars';
      headerEl.appendChild(starsEl);
    }
    starsEl.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
        <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
      ${repoData.stars}
    `;
  }

  // Add action buttons
  let actionsEl = cardElement.querySelector('.project-actions');
  if (!actionsEl) {
    actionsEl = document.createElement('div');
    actionsEl.className = 'project-actions';
    cardElement.appendChild(actionsEl);
  }

  actionsEl.innerHTML = '';

  // Add Live Demo button if URL is provided
  if (liveDemo) {
    const demoBtn = document.createElement('a');
    demoBtn.href = liveDemo;
    demoBtn.target = '_blank';
    demoBtn.className = 'project-btn demo-btn';
    demoBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
        <path fill="currentColor" d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6zm2-8h8v2H8v-2zm0 4h8v2H8v-2z"/>
      </svg>
      Live Demo
    `;
    actionsEl.appendChild(demoBtn);
  }

  // Add View on GitHub button
  const githubBtn = document.createElement('a');
  githubBtn.href = githubUrl;
  githubBtn.target = '_blank';
  githubBtn.className = 'project-btn github-btn';
  githubBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
      <path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
    View on GitHub
  `;
  actionsEl.appendChild(githubBtn);
}

async function loadGitHubData() {
  const projectCards = document.querySelectorAll('.project-card');

  // Show loading state for all cards
  projectCards.forEach(card => showLoadingState(card));

  // Fetch and update data for each card
  for (let i = 0; i < CONFIG.githubRepos.length && i < projectCards.length; i++) {
    const { owner, repo, tags, liveDemo } = CONFIG.githubRepos[i];
    const githubUrl = `https://github.com/${owner}/${repo}`;
    const repoData = await fetchGitHubRepoData(owner, repo);
    updateProjectCard(projectCards[i], repoData, tags, githubUrl, liveDemo);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadGitHubData();
});
