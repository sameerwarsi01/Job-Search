import { FiPlus } from "react-icons/fi";

function JobHeader({ openModal }) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Applications
        </h1>

        <p className="mt-2 text-slate-500">
          Track and manage all your job applications.
        </p>
      </div>

      <button
        onClick={openModal}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
        <FiPlus />
        Add Application
</button>

    </div>
  );
}

export default JobHeader;