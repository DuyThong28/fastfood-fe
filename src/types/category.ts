import { Meta, Respone } from "./api";

export interface Category {
  id: string;
  name: string;
  is_disable: boolean;
}

export interface ResFetchAllCategories extends Respone {
  data: {
    data: Array<Category>;
    meta: Meta;
  };
}

export interface ResEnableCategoryById extends Respone {
  data: {
    data: Category;
  };
}

export interface ResDisableCategoryById extends Respone {
  data: {
    data: Category;
  };
}

export interface ResGetCategoryById extends Respone {
  data: {
    data: Category;
  };
}
