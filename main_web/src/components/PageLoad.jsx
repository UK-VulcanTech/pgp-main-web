export function PageSpinner() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center text-gray-500 text-sm">
      Loading…
    </div>
  );
}

export function PageError({ message = "Content could not be loaded." }) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-2 px-6 text-center">
      <p className="text-gray-600">{message}</p>
      <p className="text-xs text-gray-400 max-w-md">
        Ensure the Django API is running and <code className="text-gray-500">VITE_PUBLIC_API_URL</code> or the Vite
        dev proxy is configured (see <code className="text-gray-500">.env.example</code>).
      </p>
    </div>
  );
}
