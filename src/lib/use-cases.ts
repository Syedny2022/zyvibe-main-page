import { getAllUseCases, getUseCasesToday, getUseCaseBySlug } from './data-store';
import { CategoryCount, ToolCount } from './types';

export { getAllUseCases, getUseCasesToday, getUseCaseBySlug };

export function getAllCategories(): CategoryCount[] {
  const all = getAllUseCases();
  const map = new Map<string, { name: string; slug: string; count: number }>();

  all.forEach(item => {
    const key = item.categorySlug;
    if (map.has(key)) {
      map.get(key)!.count++;
    } else {
      map.set(key, { name: item.category, slug: item.categorySlug, count: 1 });
    }
  });

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function getAllTools(): ToolCount[] {
  const all = getAllUseCases();
  const map = new Map<string, { name: string; slug: string; count: number }>();

  all.forEach(item => {
    const key = item.toolSlug;
    if (map.has(key)) {
      map.get(key)!.count++;
    } else {
      map.set(key, { name: item.tool, slug: item.toolSlug, count: 1 });
    }
  });

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}
