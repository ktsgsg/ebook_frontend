// 検索結果の型定義
export interface SearchHit {
   id: string
   title?: string
   content?: string
   authors?: string
   publisher?: string
   publication_date?: string
   description?: string
   genre?: string
   language?: string
   ndc_class?: string
   subject?: string
   [key: string]: unknown
}

export interface SearchResponse {
   hits: SearchHit[]
   query: string
   processingTimeMs: number
   limit: number
   offset: number
   estimatedTotalHits: number
}

// 詳細検索パラメータの型定義
export interface AdvancedSearchParams {
   keyword?: string
   title?: string
   authors?: string
   publisher?: string
   genre?: string
   language?: string
   publication_date_from?: string
   publication_date_to?: string
   ndc_class?: string
   subject?: string
}

// 目次の型定義
export interface TableOfContentsItem {
   chapter: string
   page: number
}

// 本の詳細データの型定義
export interface BookDetail {
   title: string
   authors: string
   publisher: string
   publication_country: string
   language: string
   publication_date: string
   page_count: string
   isbn: string
   eisbn: string
   genre: string
   ndc_class: string
   subject: string
   content_id: string
   downloadable_after_purchase: string
   description: string
   table_of_contents: TableOfContentsItem[]
}

