// A simple loading spinner component.

export default function Loader() {
  return (
    <div className="flex justify-center items-center p-10">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
    </div>
  );
}
