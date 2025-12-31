export default function CaseStudiesSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-12 animate-pulse" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-80 rounded-3xl bg-gray-200 dark:bg-gray-700 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
