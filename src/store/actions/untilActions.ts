import { createAsyncThunk } from '@reduxjs/toolkit';

import type { IFetchSeachFilter } from '@/apiService/util';
import {
  fetchAllCategories,
  fetchAllCountries,
  fetchAllIndustries,
  fetchAllStages,
  fetchSeachFilter,
} from '@/apiService/util';

export const fetchAllCountriesAction = createAsyncThunk(
  'util/fetchAllCountriesAction',
  async () => {
    const response: any = await fetchAllCountries();
    return response;
  },
);

export const fetchAllCategoriesAction = createAsyncThunk(
  'util/fetchAllCategoriesAction',
  async () => {
    const response: any = await fetchAllCategories();
    return response;
  },
);

export const fetchAllIndustriesAction = createAsyncThunk(
  'util/fetchAllIndustriesAction',
  async () => {
    const response: any = await fetchAllIndustries();
    return response;
  },
);

export const fetchAllStagesAction = createAsyncThunk(
  'util/fetchAllStagesAction',
  async () => {
    const response: any = await fetchAllStages();
    return response;
  },
);

export const fetchSeachFilterAction = createAsyncThunk(
  'util/fetchSeachFilterAction',
  async (query: IFetchSeachFilter) => {
    const response: any = await fetchSeachFilter(query);
    return response;
  },
);
