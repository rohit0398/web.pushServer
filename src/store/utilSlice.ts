/* eslint-disable no-param-reassign */

import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import {
  fetchAllCategoriesAction,
  fetchAllCountriesAction,
  fetchAllIndustriesAction,
  fetchAllStagesAction,
  fetchSeachFilterAction,
} from './actions/untilActions';

export type ICountry = { value: string; name: string; code: string };
export type ICategory = { value: string; name: string };
export type IStage = { value: string; name: string };
export type IIndustry = { value: string; name: string };

type IState = {
  loading: boolean;
  countries: ICountry[];
  categories: ICategory[];
  stages: IStage[];
  industries: IIndustry[];
  searchPageLoading: boolean;
  searchPage: {
    deals: any;
    investors: any;
    startsups: any;
  };
  notFound: boolean;
};
const initialState: IState = {
  loading: false,
  countries: [],
  categories: [],
  stages: [],
  industries: [],
  searchPageLoading: false,
  searchPage: {
    deals: [],
    investors: [],
    startsups: [],
  },
  notFound: false,
};
export const utilSlice = createSlice({
  name: 'util',
  initialState,
  reducers: {
    setReducerLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: any) => {
      return {
        ...state,
        ...action.payload,
      };
    });

    builder.addCase(fetchAllCountriesAction.fulfilled, (state, action) => {
      state.countries = [
        { value: 'all', name: 'all' },
        ...action.payload.map((val: any) => {
          return { value: String(val.id), name: val.name, code: val.code };
        }),
      ] as any;
    });

    builder.addCase(fetchAllCategoriesAction.fulfilled, (state, action) => {
      state.categories = [
        { value: 'all', name: 'all' },
        ...action.payload.map((val: any) => {
          return { value: String(val.id), name: val.name };
        }),
      ] as any;
    });

    builder.addCase(fetchAllStagesAction.fulfilled, (state, action) => {
      state.stages = [
        { value: 'all', name: 'all' },
        ...action.payload.map((val: any) => {
          return { value: String(val.id), name: val.name };
        }),
      ] as any;
    });

    builder.addCase(fetchAllIndustriesAction.fulfilled, (state, action) => {
      state.industries = [
        { value: 'all', name: 'all' },
        ...action.payload.map((val: any) => {
          return { value: String(val.id), name: val.name };
        }),
      ] as any;
    });

    builder.addCase(fetchSeachFilterAction.fulfilled, (state, action) => {
      state.searchPage = action.payload;
      state.searchPageLoading = false;
      if (
        Array.isArray(action.payload.startsups) &&
        Array.isArray(action.payload.deals) &&
        Array.isArray(action.payload.investors) &&
        action.payload.investors.length === 0 &&
        action.payload.deals.length === 0 &&
        action.payload.startsups.length === 0
      )
        state.notFound = true;
      else state.notFound = false;
    });
    builder.addCase(fetchSeachFilterAction.pending, (state) => {
      state.searchPageLoading = true;
      state.notFound = false;
    });
    builder.addCase(fetchSeachFilterAction.rejected, (state) => {
      state.searchPageLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const { setReducerLoading } = utilSlice.actions;

export default utilSlice.reducer;
