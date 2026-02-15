export const styles = `
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Hiragino Sans', sans-serif;
      background-color: #121212;
      min-height: 100vh;
      padding: 20px;
      color: #e0e0e0;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    header {
      text-align: center;
      margin-bottom: 30px;
    }

    h1 {
      color: #e0e0e0;
      font-size: 2rem;
      margin-bottom: 20px;
    }

    .search-form {
      display: flex;
      gap: 10px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .search-input {
      width: 100%;
      max-width: 500px;
      padding: 12px 20px;
      font-size: 16px;
      border: 2px solid #404040;
      border-radius: 25px;
      outline: none;
      transition: border-color 0.3s;
      background-color: #1e1e1e;
      color: #e0e0e0;
    }

    .search-input:focus {
      border-color: #14af09;
    }

    .search-input::placeholder {
      color: #808080;
    }

    .search-button {
      padding: 12px 30px;
      font-size: 16px;
      background-color: #39b400;
      color: white;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .search-button:hover {
      background-color: #004521;
    }

    .results-info {
      margin: 20px 0;
      color: #b0b0b0;
      text-align: center;
    }

    .error {
      color: #ff6b6b;
      text-align: center;
      padding: 20px;
      background-color: #2d1f1f;
      border-radius: 8px;
      margin: 20px 0;
    }
    }

    .results-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-top: 20px;
    }

    .result-card {
      background: #1e1e1e;
      border-radius: 12px 12px 0 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
      display: flex;
      flex-direction: row;
      align-items: stretch;
    }

    .card-link {
      text-decoration: none;
      display: block;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      transition: box-shadow 0.2s;
    }

    .card-link:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
    }

    .card-link .result-card {
      box-shadow: none;
      border-radius: 0;
    }

    .result-card:hover {
      transform: translateX(4px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
    }

    .thumbnail-container {
      width: 80px;
      min-width: 80px;
      height: 110px;
      background-color: #2a2a2a;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .card-link:hover .thumbnail-container {
      width: 160px;
      min-width: 160px;
      height: 220px;
    }

    .thumbnail {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: all 0.3s ease;
    }

    .thumbnail-placeholder {
      color: #666;
      font-size: 12px;
    }

    .card-content {
      padding: 15px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .card-title {
      font-size: 15px;
      font-weight: 600;
      color: #e0e0e0;
      margin-bottom: 6px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.4;
    }

    .card-meta {
      font-size: 13px;
      color: #b0b0b0;
      margin-bottom: 4px;
    }

    .card-id {
      font-size: 12px;
      color: #808080;
    }

    .card-description {
      max-height: 0;
      overflow: hidden;
      background: #252525;
      transition: max-height 0.3s ease-out, padding 0.3s ease-out;
      padding: 0 15px;
      border-top: 0 solid #333;
    }

    .result-card:hover + .card-description,
    .card-description:hover {
      max-height: 200px;
      padding: 15px;
      border-top: 1px solid #333;
    }

    .card-link:hover .card-description {
      max-height: 200px;
      padding: 15px;
      border-top: 1px solid #333;
    }

    .description-title {
      font-size: 13px;
      font-weight: 600;
      color: #e0e0e0;
      margin-bottom: 6px;
    }

    .description-meta {
      font-size: 12px;
      color: #b0b0b0;
      margin-bottom: 8px;
    }

    .description-text {
      font-size: 13px;
      color: #c0c0c0;
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .description-none {
      font-size: 13px;
      color: #666;
      font-style: italic;
    }

    .card-actions {
      padding: 10px 15px;
      border-top: 1px solid #333;
    }

    .pdf-link {
      display: inline-block;
      padding: 6px 12px;
      background-color: #2e7d32;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-size: 12px;
      transition: background-color 0.2s;
    }

    .pdf-link:hover {
      background-color: #1b5e20;
    }

    .no-results {
      text-align: center;
      padding: 40px;
      color: #808080;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 15px;
      margin-top: 30px;
      padding: 20px 0;
    }

    .pagination a {
      padding: 10px 20px;
      border: 1px solid #404040;
      background: #1e1e1e;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.2s;
      text-decoration: none;
      color: #e0e0e0;
      font-size: 14px;
    }

    .pagination a:hover {
      background-color: #2a2a2a;
    }

    .pagination .disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    .pagination .page-info {
      color: #b0b0b0;
      font-size: 14px;
    }

    /* 詳細ページ用スタイル */
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      color: #5c9ce6;
      text-decoration: none;
      margin-bottom: 20px;
      font-size: 14px;
    }

    .back-link:hover {
      text-decoration: underline;
    }

    .book-detail {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 30px;
      background: #1e1e1e;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    @media (max-width: 768px) {
      .book-detail {
        grid-template-columns: 1fr;
      }
    }

    .book-thumbnail {
      width: 100%;
      max-width: 300px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }

    .book-info {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .book-title {
      font-size: 1.5rem;
      color: #e0e0e0;
      line-height: 1.4;
      margin-bottom: 5px;
    }

    .book-meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
      font-size: 14px;
      color: #b0b0b0;
      background: #252525;
      padding: 15px;
      border-radius: 8px;
    }

    .book-meta-item {
      display: flex;
      gap: 8px;
    }

    .book-meta-label {
      font-weight: 600;
      color: #e0e0e0;
      min-width: 80px;
    }

    .book-description {
      background: #252525;
      padding: 20px;
      border-radius: 8px;
      line-height: 1.8;
      color: #c0c0c0;
    }

    .book-description h3 {
      margin-bottom: 10px;
      color: #e0e0e0;
      font-size: 1.1rem;
    }

    .book-actions {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }

    .book-actions .pdf-link {
      padding: 12px 24px;
      font-size: 14px;
    }

    .toc-section {
      margin-top: 30px;
      background: #1e1e1e;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .toc-section h2 {
      color: #e0e0e0;
      font-size: 1.3rem;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #333;
    }

    .toc-list {
      list-style: none;
    }

    .toc-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 15px;
      border-bottom: 1px solid #333;
      transition: background-color 0.2s;
    }

    .toc-item:hover {
      background-color: #252525;
    }

    .toc-item:last-child {
      border-bottom: none;
    }

    .toc-chapter {
      color: #e0e0e0;
      flex: 1;
    }

    .toc-page {
      color: #808080;
      font-size: 14px;
      min-width: 50px;
      text-align: right;
    }

    .card-link {
      text-decoration: none;
      color: inherit;
      display: block;
    }
`
