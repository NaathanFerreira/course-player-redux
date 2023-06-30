import { create } from "zustand";
import { api } from "../lib/axios";

interface Course {
  id: number;
  modules: Array<{
    id: number;
    title: string;
    lessons: Array<{
      id: string;
      title: string;
      duration: string;
    }>;
  }>;
}

export interface PlayerState {
  course: Course | null;
  currentModuleIndex: number;
  currentLessonIndex: number;
  isLoading: boolean;

  load: () => Promise<void>;
  play: (moduleAndLessonIndex: {
    moduleIndex: number;
    lessonIndex: number;
  }) => void;
  next: () => void;
}

export const useStore = create<PlayerState>((set, get) => {
  return {
    course: null,
    currentModuleIndex: 0,
    currentLessonIndex: 0,
    isLoading: true,

    load: async () => {
      set({
        isLoading: true,
      });
      const { data } = await api.get("/courses/1");

      set({
        course: data,
        isLoading: false,
      });
    },

    play: (moduleAndLessonIndex: {
      moduleIndex: number;
      lessonIndex: number;
    }) => {
      set({
        currentModuleIndex: moduleAndLessonIndex.moduleIndex,
        currentLessonIndex: moduleAndLessonIndex.lessonIndex,
      });
    },

    next: () => {
      const { currentModuleIndex, currentLessonIndex, course } = get();

      const nextLessonIndex = currentLessonIndex + 1;

      const nextLesson =
        course?.modules[currentModuleIndex].lessons[nextLessonIndex];

      if (nextLesson) {
        set({
          currentLessonIndex: nextLessonIndex,
        });
        return;
      }

      const nextModuleIndex = currentModuleIndex + 1;
      const nextModule = course?.modules[nextModuleIndex];

      if (nextModule) {
        set({
          currentModuleIndex: nextModuleIndex,
          currentLessonIndex: 0,
        });
      }
    },
  };
});

export const useCurrentLesson = () => {
  return useStore((state) => {
    const { currentModuleIndex, currentLessonIndex } = state;

    const currentModule = state.course?.modules[currentModuleIndex];

    const currentLesson = currentModule?.lessons[currentLessonIndex];
    return { currentModule, currentLesson };
  });
};
