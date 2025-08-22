export default function Button({ children, type = "button", onClick, disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-2xl bg-black px-4 py-2 font-medium text-white shadow hover:opacity-90 disabled:opacity-50"
    >
      {children}
    </button>
  );
}
