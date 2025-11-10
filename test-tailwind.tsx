// Test file for Tailwind CSS IntelliSense
// Try typing "bg-" or "text-" and see if autocomplete appears
// Also check if you see color previews for classes like bg-red-500

export default function TestTailwind() {
  return (
    <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg hover:bg-blue-500 transition-colors">
      <h1 className="text-2xl font-bold mb-2">Tailwind Test</h1>
      <p className="text-gray-100">
        If you see color previews and get autocomplete, Tailwind IntelliSense is working!
      </p>
      <button className="bg-logo hover:bg-logo-hover text-white px-4 py-2 rounded mt-4">
        Custom Colors Test
      </button>
    </div>
  );
}