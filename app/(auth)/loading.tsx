export default function Loading() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-300 rounded w-1/3"></div>
        <div className="space-y-2">
          <div className="h-6 bg-gray-300 rounded"></div>
          <div className="h-6 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
}
