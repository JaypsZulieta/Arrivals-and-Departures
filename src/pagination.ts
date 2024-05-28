export type PaginationOptions = {
  pageNumber?: number;
  pageSize?: number;
};

export type PaginatedContent<TContent> = {
  totalItems: number;
  totalPages: number;
  content: TContent[];
  currentPage: number;
};

export class PaginatedContentBuilder<TContent> {
  private totalItemsToSet: number;
  private totalPagesToSet: number;
  private contentToSet: TContent[];
  private currentPageToSet: number;

  public totalItems(total: number): PaginatedContentBuilder<TContent> {
    this.totalItemsToSet = total;
    return this;
  }

  public totalPages(total: number): PaginatedContentBuilder<TContent> {
    this.totalPagesToSet = total;
    return this;
  }

  public content(content: TContent[]): PaginatedContentBuilder<TContent> {
    this.contentToSet = content;
    return this;
  }

  public currentPage(page: number): PaginatedContentBuilder<TContent> {
    this.currentPageToSet = page;
    return this;
  }

  public build(): PaginatedContent<TContent> {
    return {
      totalItems: this.totalItemsToSet,
      totalPages: this.totalPagesToSet,
      content: this.contentToSet,
      currentPage: this.currentPageToSet,
    };
  }
}
