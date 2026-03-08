export default function Card({ title, children, actions, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 sm:p-6 ${className}`}>
      {(title || actions) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4">
          {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
