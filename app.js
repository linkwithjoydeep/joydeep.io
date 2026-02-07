// Add SEO and social sharing meta tags
function addSEOMetaTags() {
  const head = document.head;

  // Basic meta tags
  const metaTags = [
    { name: 'description', content: CONFIG.seo.description },
    { name: 'keywords', content: CONFIG.seo.keywords },
    { name: 'author', content: CONFIG.seo.author },

    // Open Graph (Facebook, LinkedIn)
    { property: 'og:title', content: CONFIG.seo.title },
    { property: 'og:description', content: CONFIG.seo.description },
    { property: 'og:image', content: CONFIG.seo.image },
    { property: 'og:url', content: CONFIG.seo.siteUrl },
    { property: 'og:type', content: CONFIG.seo.type },
    { property: 'og:site_name', content: CONFIG.name },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: CONFIG.seo.title },
    { name: 'twitter:description', content: CONFIG.seo.description },
    { name: 'twitter:image', content: CONFIG.seo.image },
    { name: 'twitter:creator', content: CONFIG.seo.twitterHandle },

    // Additional
    { name: 'robots', content: 'index, follow' },
    { name: 'googlebot', content: 'index, follow' }
  ];

  // Add or update meta tags
  metaTags.forEach(tag => {
    const attribute = tag.name ? 'name' : 'property';
    const attributeValue = tag.name || tag.property;

    let metaElement = head.querySelector(`meta[${attribute}="${attributeValue}"]`);

    if (!metaElement) {
      metaElement = document.createElement('meta');
      metaElement.setAttribute(attribute, attributeValue);
      head.appendChild(metaElement);
    }

    metaElement.setAttribute('content', tag.content);
  });

  // Add canonical URL
  let canonicalLink = head.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    head.appendChild(canonicalLink);
  }
  canonicalLink.href = CONFIG.seo.siteUrl;

  // Add JSON-LD structured data
  addStructuredData();
}

// Add JSON-LD structured data for search engines
function addStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": CONFIG.name,
    "jobTitle": CONFIG.title,
    "email": CONFIG.email,
    "url": CONFIG.seo.siteUrl,
    "image": CONFIG.seo.image,
    "sameAs": [
      CONFIG.social.github,
      CONFIG.social.linkedin,
      CONFIG.social.medium,
      CONFIG.social.personalBlog
    ],
    "description": CONFIG.about,
    "alumniOf": CONFIG.education.map(edu => ({
      "@type": "EducationalOrganization",
      "name": edu.institution
    })),
    "knowsAbout": CONFIG.skills
  };

  let scriptTag = document.querySelector('script[type="application/ld+json"]');
  if (!scriptTag) {
    scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';
    document.head.appendChild(scriptTag);
  }

  scriptTag.textContent = JSON.stringify(structuredData, null, 2);
}

// Initialize the website with config data
function initializeWebsite() {
  // Update page title and favicon
  document.title = CONFIG.seo.title;
  document.querySelector('link[rel="icon"]').href = CONFIG.favicon;

  // Add SEO meta tags
  addSEOMetaTags();

  // Update header
  document.querySelector('.name').textContent = CONFIG.name;
  document.querySelector('.title').textContent = CONFIG.title;

  // Update contact info
  const emailLink = document.querySelector('.email-wrapper a');
  emailLink.href = `mailto:${CONFIG.email}`;
  emailLink.textContent = CONFIG.email;

  document.querySelector('.contact-info span:last-child').innerHTML = `Location: ${CONFIG.location}`;

  // Update profile picture
  document.querySelector('.profile-picture img').src = CONFIG.profileImage;
  document.querySelector('.profile-picture img').alt = CONFIG.name;

  // Update social links
  const socialLinks = document.querySelectorAll('.social-links a');
  socialLinks[0].href = CONFIG.social.github; // GitHub
  socialLinks[1].href = CONFIG.social.linkedin; // LinkedIn
  socialLinks[2].href = CONFIG.social.email; // Email
  socialLinks[3].href = CONFIG.social.medium; // Medium
  socialLinks[4].href = CONFIG.social.personalBlog; // Personal Blog

  // Update About Me
  document.querySelector('.about-me p').textContent = CONFIG.about;

  // Update Skills
  const skillsGrid = document.querySelector('.skills-grid');
  skillsGrid.innerHTML = '';
  CONFIG.skills.forEach(skill => {
    const skillTag = document.createElement('span');
    skillTag.className = 'skill-tag';
    skillTag.textContent = skill;
    skillsGrid.appendChild(skillTag);
  });

  // Update Experience
  const experienceSection = document.querySelector('#experience');
  const existingExperiences = experienceSection.querySelectorAll('.experience-item');
  existingExperiences.forEach(exp => exp.remove());

  CONFIG.experience.forEach(exp => {
    const expItem = document.createElement('div');
    expItem.className = 'experience-item';

    expItem.innerHTML = `
      <div class="experience-header">
        <h3 class="job-title">${exp.title}</h3>
        <div class="company-period">
          <span class="company">${exp.company}</span>
          <span class="period">${exp.period}</span>
        </div>
      </div>
      <p class="experience-description">${exp.description}</p>
      <ul class="achievements">
        ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
      </ul>
    `;

    experienceSection.appendChild(expItem);
  });

  // Update Education
  const educationSection = document.querySelector('#education');
  const existingEducation = educationSection.querySelectorAll('.education-item');
  existingEducation.forEach(edu => edu.remove());

  CONFIG.education.forEach(edu => {
    const eduItem = document.createElement('div');
    eduItem.className = 'education-item';

    const credentialLink = edu.credentialUrl
      ? `<a href="${edu.credentialUrl}" target="_blank" class="credential-link">View Credential →</a>`
      : '';

    eduItem.innerHTML = `
      <div class="education-header">
        <h3 class="degree-title">${edu.degree}</h3>
        <div class="institution-info">
          <span class="institution">${edu.institution}</span>
          ${credentialLink}
        </div>
      </div>
    `;

    educationSection.appendChild(eduItem);
  });

  // Update Recommendations
  const recommendationsLink = document.querySelector('.recommendations-link');
  recommendationsLink.textContent = CONFIG.recommendations.text;
  recommendationsLink.href = CONFIG.recommendations.url;

  // Update Footer
  document.querySelector('footer p').innerHTML = `
    &copy; ${CONFIG.footer.copyright}<br>
    ${CONFIG.footer.madeBy} <a href="${CONFIG.footer.websiteUrl}" target="_blank">${CONFIG.name}</a>
  `;
}

// Email copy functionality
function copyEmail() {
  navigator.clipboard.writeText(CONFIG.email).then(() => {
    const tooltip = document.getElementById('copyTooltip');
    tooltip.classList.add('show');
    setTimeout(() => {
      tooltip.classList.remove('show');
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy email:', err);
  });
}

// Theme Switcher
function initializeTheme() {
  // Check for saved theme preference or default to dark
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Use saved theme, or fall back to system preference (default to dark)
  const theme = savedTheme || (systemPrefersDark ? 'dark' : 'dark');

  applyTheme(theme);

  // Listen for theme toggle button
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only auto-switch if user hasn't manually set a preference
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcon(theme);

  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#ffffff');
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  applyTheme(newTheme);
  localStorage.setItem('theme', newTheme);
}

function updateThemeIcon(theme) {
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');

  if (theme === 'dark') {
    // Show sun icon in dark mode
    if (sunIcon) sunIcon.style.display = 'block';
    if (moonIcon) moonIcon.style.display = 'none';
  } else {
    // Show moon icon in light mode
    if (sunIcon) sunIcon.style.display = 'none';
    if (moonIcon) moonIcon.style.display = 'block';
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  initializeWebsite();
});
