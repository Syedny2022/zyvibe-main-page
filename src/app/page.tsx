import { getAllUseCases, getAllCategories, getAllTools } from '../lib/use-cases';
import DirectoryView from '../components/DirectoryView';

export const revalidate = 60; // Auto-revalidate every minute if files change

export default function HomePage() {
  const useCases = getAllUseCases();
  const categories = getAllCategories();
  const tools = getAllTools();

  return (
    <DirectoryView
      useCases={useCases}
      categories={categories}
      tools={tools}
    />
  );
}
