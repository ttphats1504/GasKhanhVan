interface Banner {
  id: string;
  image: string;
  order: number;
  categoryId?: number | null;
  categoryName?: string; // For display purposes
}

export default Banner;
