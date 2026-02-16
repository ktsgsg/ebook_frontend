export const styles = `
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Hiragino Sans', sans-serif;
      background-color: #f5f5f5;
      min-height: 100vh;
      padding: 20px;
      color: #333;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
    }

    header {
      text-align: center;
      margin-bottom: 30px;
      background-color: #003366;
      padding: 20px;
      margin: -20px -20px 30px -20px;
    }

    h1 {
      color: #fff;
      font-size: 1.5rem;
      margin-bottom: 15px;
    }

    .search-form {
      display: flex;
      gap: 10px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .search-input {
      width: 100%;
      max-width: 400px;
      padding: 8px 12px;
      font-size: 14px;
      border: 1px solid #ccc;
      outline: none;
      background-color: #fff;
      color: #333;
    }

    .search-input:focus {
      border-color: #003366;
    }

    .search-input::placeholder {
      color: #999;
    }

    .search-button {
      padding: 8px 20px;
      font-size: 14px;
      background-color: #c00;
      color: white;
      border: none;
      cursor: pointer;
    }

    .search-button:hover {
      background-color: #900;
    }

    .results-info {
      margin: 15px 0;
      color: #666;
      font-size: 14px;
      padding: 10px;
      background-color: #e8e8e8;
      border-left: 4px solid #003366;
    }

    .error {
      color: #c00;
      padding: 15px;
      background-color: #fee;
      border: 1px solid #c00;
      margin: 15px 0;
    }

    .results-list {
      display: flex;
      flex-direction: column;
      gap: 0;
      margin-top: 15px;
      border: 1px solid #ccc;
      background-color: #fff;
    }

    .result-card {
      background: #fff;
      overflow: hidden;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      padding: 15px;
    }

    .card-link {
      text-decoration: none;
      display: block;
      overflow: hidden;
      border-bottom: 1px solid #ddd;
    }

    .card-link:last-child {
      border-bottom: none;
    }

    .card-link:hover {
      background-color: #f0f7ff;
    }

    .card-link .result-card {
      border: none;
    }

    .thumbnail-container {
      width: 80px;
      min-width: 80px;
      height: 110px;
      background-color: #eee;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      margin-right: 15px;
      border: 1px solid #ddd;
    }

    .thumbnail {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .thumbnail-placeholder {
      color: #999;
      font-size: 11px;
    }

    .card-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .card-title {
      font-size: 14px;
      font-weight: bold;
      color: #003366;
      margin-bottom: 8px;
      line-height: 1.4;
    }

    .card-link:hover .card-title {
      text-decoration: underline;
    }

    .card-meta {
      font-size: 13px;
      color: #666;
      margin-bottom: 4px;
    }

    .card-id {
      font-size: 11px;
      color: #999;
    }

    .card-description {
      background: transparent;
      padding: 8px 0 0 0;
      margin-top: 8px;
      border-top: 1px dotted #ccc;
    }

    .description-title {
      font-size: 12px;
      font-weight: bold;
      color: #333;
      margin-bottom: 4px;
    }

    .description-meta {
      font-size: 12px;
      color: #666;
      margin-bottom: 4px;
    }

    .description-text {
      font-size: 12px;
      color: #555;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .description-none {
      font-size: 12px;
      color: #999;
    }

    .card-actions {
      padding: 8px 0;
    }

    .pdf-link {
      display: inline-block;
      padding: 4px 10px;
      background-color: #003366;
      color: white;
      text-decoration: none;
      font-size: 11px;
    }

    .pdf-link:hover {
      background-color: #002244;
    }

    .no-results {
      text-align: center;
      padding: 40px;
      color: #666;
      background-color: #fff;
      border: 1px solid #ccc;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      margin-top: 20px;
      padding: 15px 0;
    }

    .pagination a {
      padding: 6px 12px;
      border: 1px solid #003366;
      background: #fff;
      cursor: pointer;
      text-decoration: none;
      color: #003366;
      font-size: 13px;
    }

    .pagination a:hover {
      background-color: #003366;
      color: #fff;
    }

    .pagination .disabled {
      opacity: 0.4;
      cursor: not-allowed;
      pointer-events: none;
    }

    .pagination .page-info {
      color: #666;
      font-size: 13px;
    }

    /* 詳細ページ用スタイル */
    .back-link {
      display: inline-block;
      color: #003366;
      text-decoration: none;
      margin-bottom: 15px;
      font-size: 13px;
    }

    .back-link:hover {
      text-decoration: underline;
    }

    .book-detail {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 20px;
      background: #fff;
      padding: 20px;
      border: 1px solid #ccc;
    }

    @media (max-width: 768px) {
      .book-detail {
        grid-template-columns: 1fr;
      }
    }

    .book-thumbnail {
      width: 100%;
      max-width: 200px;
      border: 1px solid #ddd;
    }

    .book-info {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .book-title {
      font-size: 1.2rem;
      color: #003366;
      line-height: 1.4;
      margin-bottom: 5px;
      border-bottom: 2px solid #003366;
      padding-bottom: 8px;
    }

    .book-meta {
      font-size: 13px;
      color: #333;
      background: #f9f9f9;
      padding: 12px;
      border: 1px solid #ddd;
    }

    .book-meta-item {
      display: flex;
      gap: 8px;
      padding: 4px 0;
      border-bottom: 1px dotted #ddd;
    }

    .book-meta-item:last-child {
      border-bottom: none;
    }

    .book-meta-label {
      font-weight: bold;
      color: #003366;
      min-width: 80px;
    }

    .book-description {
      background: #f9f9f9;
      padding: 15px;
      line-height: 1.7;
      color: #333;
      border: 1px solid #ddd;
      font-size: 13px;
    }

    .book-description h3 {
      margin-bottom: 8px;
      color: #003366;
      font-size: 14px;
    }

    .book-actions {
      margin-top: 10px;
    }

    .book-actions .pdf-link {
      padding: 10px 20px;
      font-size: 13px;
    }

    .toc-section {
      margin-top: 20px;
      background: #fff;
      padding: 20px;
      border: 1px solid #ccc;
    }

    .toc-section h2 {
      color: #003366;
      font-size: 1.1rem;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #003366;
    }

    .toc-list {
      list-style: none;
    }

    .toc-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 10px;
      border-bottom: 1px dotted #ddd;
      font-size: 13px;
    }

    .toc-item:hover {
      background-color: #f0f7ff;
    }

    .toc-item:last-child {
      border-bottom: none;
    }

    .toc-chapter {
      color: #333;
      flex: 1;
    }

    .toc-page {
      color: #666;
      font-size: 12px;
      min-width: 50px;
      text-align: right;
    }

    .card-link {
      text-decoration: none;
      color: inherit;
      display: block;
    }

    /* 詳細検索リンク */
    .advanced-search-link,
    .simple-search-link {
      display: inline-block;
      margin-top: 10px;
      color: #fff;
      font-size: 13px;
      text-decoration: underline;
    }

    .advanced-search-link:hover,
    .simple-search-link:hover {
      color: #cce;
    }

    /* 詳細検索フォーム */
    .advanced-search-section {
      background-color: #fff;
      border: 1px solid #ccc;
      padding: 20px;
      margin-bottom: 20px;
    }

    .advanced-search-section h2 {
      color: #003366;
      font-size: 1.1rem;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #003366;
    }

    .advanced-search-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .form-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .form-row label {
      min-width: 100px;
      font-size: 13px;
      font-weight: bold;
      color: #003366;
    }

    .form-row input[type="text"] {
      flex: 1;
      padding: 8px 12px;
      font-size: 13px;
      border: 1px solid #ccc;
      background-color: #fff;
      color: #333;
    }

    .form-row input[type="text"]:focus {
      border-color: #003366;
      outline: none;
    }

    .form-row input[type="text"]::placeholder {
      color: #999;
    }

    .date-range {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
    }

    .date-range input {
      flex: 1;
      max-width: 150px;
    }

    .date-range span {
      color: #666;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 10px;
      padding-top: 15px;
      border-top: 1px solid #ddd;
    }

    .clear-button {
      padding: 8px 20px;
      font-size: 14px;
      background-color: #666;
      color: white;
      border: none;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
    }

    .clear-button:hover {
      background-color: #444;
    }

    @media (max-width: 600px) {
      .form-row {
        flex-direction: column;
        align-items: flex-start;
      }

      .form-row label {
        min-width: auto;
        margin-bottom: 5px;
      }

      .form-row input[type="text"] {
        width: 100%;
      }

      .date-range {
        flex-direction: column;
        width: 100%;
      }

      .date-range input {
        max-width: none;
        width: 100%;
      }
    }
`
