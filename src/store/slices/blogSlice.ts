import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BlogArticle } from '../../types';
import { MockBusApi } from '../../services/mockApi';
import { BLOG_ARTICLES } from '../../services/mockData';

interface BlogState {
  articles: BlogArticle[];
  selectedCategory: string;
  selectedTag: string | null;
  searchQuery: string;
  activeArticle: BlogArticle | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  articles: BLOG_ARTICLES,
  selectedCategory: 'All',
  selectedTag: null,
  searchQuery: '',
  activeArticle: null,
  isLoading: false,
  error: null,
};

export const fetchBlogArticles = createAsyncThunk(
  'blog/fetchArticles',
  async (params?: { category?: string; tag?: string; search?: string }) => {
    const results = await MockBusApi.getBlogs(params);
    return results && results.length > 0 ? results : BLOG_ARTICLES;
  }
);

export const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedTag: (state, action: PayloadAction<string | null>) => {
      state.selectedTag = action.payload;
    },
    setBlogSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setActiveArticle: (state, action: PayloadAction<BlogArticle | null>) => {
      state.activeArticle = action.payload;
    },
    clearBlogFilters: (state) => {
      state.selectedCategory = 'All';
      state.selectedTag = null;
      state.searchQuery = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogArticles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.articles = action.payload;
      })
      .addCase(fetchBlogArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch articles';
      });
  },
});

export const {
  setSelectedCategory,
  setSelectedTag,
  setBlogSearchQuery,
  setActiveArticle,
  clearBlogFilters,
} = blogSlice.actions;

export default blogSlice.reducer;
