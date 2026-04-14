export default function FormField({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">{error}</p>
      )}
    </div>
  );
}
