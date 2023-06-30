import { useCurrentLesson, useStore } from "../zustand-store";

export function Header() {
  const { currentModule, currentLesson } = useCurrentLesson();
  const isLoading = useStore((store) => store.isLoading);

  if (isLoading) {
    return <h1 className="text-2xl font-bold">Loading...</h1>;
  }

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-bold">{currentModule?.title}</h1>
      <span className="text-sm text-zinc-400">{currentLesson?.title}</span>
    </div>
  );
}
