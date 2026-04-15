// src/scripts/main.js

document.addEventListener('DOMContentLoaded', () => {

  // ================= 1. 触发系统级蓝色等待指针 =================
  const triggerLoading = () => {
    document.body.classList.add('is-loading');
  };

  const links = document.querySelectorAll('.article-link, .aero-nav-btn');
  links.forEach(link => {
    link.addEventListener('click', () => triggerLoading());
  });

  // ================= 2. 布局模式切换逻辑 (手机/桌面) =================
  const mobileBtns = document.querySelectorAll('.btn-mobile-view');
  const desktopBtns = document.querySelectorAll('.btn-desktop-view');

  mobileBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.body.classList.add('mode-mobile');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  desktopBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.body.classList.remove('mode-mobile');
    });
  });

  // ================= 3. 代码块一键复制逻辑 =================
  const codeBlocks = document.querySelectorAll('pre');
  codeBlocks.forEach((block) => {
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    block.parentNode.insertBefore(wrapper, block);
    wrapper.appendChild(block);

    const copyButton = document.createElement('button');
    copyButton.className = 'copy-code-btn';
    copyButton.textContent = '复制';

    copyButton.addEventListener('click', async () => {
      const codeText = block.querySelector('code')?.innerText || block.innerText;
      try {
        await navigator.clipboard.writeText(codeText);
        copyButton.textContent = '已复制';
        setTimeout(() => { copyButton.textContent = '复制'; }, 2000);
      } catch (err) {
        console.error('复制失败!', err);
        copyButton.textContent = '失败';
      }
    });
    wrapper.appendChild(copyButton);
  });

  // ================= 4. 图片单击放大逻辑 (Aero Glass 风格) =================
  const articleImages = document.querySelectorAll('.article-body img');
  articleImages.forEach((img) => {
    img.addEventListener('click', () => {
      const modal = document.createElement('div');
      modal.className = 'zoomed-image-modal';

      const zoomedImg = document.createElement('img');
      zoomedImg.src = img.src;
      if (img.alt) zoomedImg.alt = img.alt;

      modal.appendChild(zoomedImg);
      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden';

      requestAnimationFrame(() => {
        modal.classList.add('show');
      });

      modal.addEventListener('click', () => {
        modal.classList.remove('show');
        modal.addEventListener('transitionend', () => {
            modal.remove();
            document.body.style.overflow = '';
        }, { once: true });
      });

      const handleEsc = (event) => {
        if (event.key === 'Escape') {
          modal.click();
          window.removeEventListener('keydown', handleEsc);
        }
      };
      window.addEventListener('keydown', handleEsc);
    });
  });

  // ================= 5. 随机文章引擎 =================
  const randomBtn = document.getElementById('btn-random-post');
  if (randomBtn) {
    randomBtn.addEventListener('mousedown', () => randomBtn.style.transform = 'scale(0.99)');
    randomBtn.addEventListener('mouseup', () => randomBtn.style.transform = 'scale(1)');
    randomBtn.addEventListener('click', () => {
      try {
        // 从 HTML 的 data-urls 属性中读取数据
        const postUrls = JSON.parse(randomBtn.getAttribute('data-urls'));
        if (postUrls && postUrls.length > 0) {
          triggerLoading();
          window.location.href = postUrls[Math.floor(Math.random() * postUrls.length)];
        }
      } catch (e) {
        console.error("随机跳转数据解析失败", e);
      }
    });
  }

  // ================= 6. 模糊检索引擎 =================
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const resultsContainer = document.getElementById('search-results');
  const dbElement = document.getElementById('search-db');

  if (searchInput && searchBtn && resultsContainer && dbElement) {
    let searchData = [];
    try {
      // 从隐藏的 HTML 元素中读取由 Astro 渲染好的数据库
      searchData = JSON.parse(dbElement.getAttribute('data-search'));
    } catch (e) {
      console.error("搜索数据解析失败", e);
    }

    const performSearch = () => {
      const keyword = searchInput.value.trim().toLowerCase();
      resultsContainer.innerHTML = ''; 

      if (!keyword) {
        resultsContainer.style.display = 'none';
        return;
      }

      const results = searchData.filter(article => article.title.toLowerCase().includes(keyword));

      if (results.length > 0) {
        results.forEach(res => {
          const resultItem = document.createElement('a');
          resultItem.href = res.url;
          resultItem.textContent = "📄 " + res.title;
          resultItem.style.display = 'block';
          resultItem.style.padding = '8px 5px';
          resultItem.style.color = '#1e5799';
          resultItem.style.textDecoration = 'none';
          resultItem.style.borderBottom = '1px dashed #eee';
          
          resultItem.addEventListener('mouseenter', () => resultItem.style.background = '#eaf6fd');
          resultItem.addEventListener('mouseleave', () => resultItem.style.background = 'transparent');
          resultItem.addEventListener('click', triggerLoading);
          
          resultsContainer.appendChild(resultItem);
        });
      } else {
        resultsContainer.innerHTML = '<div style="color: #999; padding: 5px;">未找到匹配的系统日志...</div>';
      }
      resultsContainer.style.display = 'block';
    };

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('input', performSearch); 
    
    // 点击外部收起搜索结果
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target) && e.target !== searchBtn) {
        resultsContainer.style.display = 'none';
      }
    });
  }
});