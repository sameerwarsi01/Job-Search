function StatsCard({
  title,
  value,
  subtitle,
  bg = "bg-white",
}) {
  return (
    <div
      className={`${bg} rounded-3xl shadow-xl border border-gray-100 p-6 w-48 hover:scale-105 transition duration-300`}
    >
      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h1 className="text-5xl font-bold mt-3 text-gray-900">
        {value}
      </h1>

      <p className="text-gray-400 mt-3">
        {subtitle}
      </p>
    </div>
  );
}

export default StatsCard;