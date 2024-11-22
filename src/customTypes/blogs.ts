export interface Category {
  id: string;
  title: string;
  createdAt: Date | string;
  createdBy: string;
}
export type Blog = {
  id: string;
  slug: string;
  blogImage: string;
  title: string;
  snippet: string;
  content?: string;
  category: Category;
  author: Creator;
  createdAt: Date | string;
};
export interface Creator {
  firstName: string;
  lastName: string;
  profilePicture?: string;
}
export interface MappedBlog {
  key: string;
  sn: number;
  title: string;
  author: string;
  blogImage?: string;
  content: string;
  createdAt: string;
  actions: JSX.Element;
}
