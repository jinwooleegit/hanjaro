export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">로딩 중...</p>
    </div>
  );
} 