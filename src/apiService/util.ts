import api from "@/utils/api";
import { queryString } from "@/utils/helper";

export type IFetchSeachFilter = {
  type?: "startups" | "investors" | "deals";
  name?: string;
  country?: number;
  stageType?: number;
  industryType?: number;
  category?: number;
  page?: number;
  limit?: number;
};

export function fetchSeachFilter(query: IFetchSeachFilter) {
  let queryTxt = queryString(query);

  return api.get(`util/search?${queryTxt}`).then((res) => {
    return res.data?.data
  });
}

export function fetchAllCategories() {
  return api.get("/deal/categories").then((res) => res?.data?.data);
}

export function fetchAllIndustries() {
  return api.get("/util/industries").then((res) => res?.data?.data);
}

export function fetchAllStages() {
  return api.get("/util/stages").then((res) => res?.data?.data);
}

export function fetchAllCountries() {
  return api.get("/util/countries").then((res) => res?.data?.data);
}
