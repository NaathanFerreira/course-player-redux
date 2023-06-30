import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAppSelector } from "..";
import { api } from "../../lib/axios";

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
}

const initialState: PlayerState = {
  course: null,
  currentModuleIndex: 0,
  currentLessonIndex: 0,
  isLoading: true,
};

// first parameter is the name of an async action
export const loadCourse = createAsyncThunk("player/load", async () => {
  const response = await api.get("/courses/1");

  return response.data;
});

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    play: (
      state,
      action: PayloadAction<{ moduleIndex: number; lessonIndex: number }>
    ) => {
      state.currentModuleIndex = action.payload.moduleIndex;
      state.currentLessonIndex = action.payload.lessonIndex;
    },
    next: (state) => {
      const nextLessonIndex = state.currentLessonIndex + 1;

      const nextLesson =
        state.course?.modules[state.currentModuleIndex].lessons[
          nextLessonIndex
        ];

      if (nextLesson) {
        state.currentLessonIndex = nextLessonIndex;
        return;
      }

      const nextModuleIndex = state.currentModuleIndex + 1;
      const nextModule = state.course?.modules[nextModuleIndex];

      if (nextModule) {
        state.currentModuleIndex = nextModuleIndex;
        state.currentLessonIndex = 0;
      }
    },
  },
  extraReducers(builder) {
    // do something when player/load/pending is executed
    builder.addCase(loadCourse.pending, (state) => {
      state.isLoading = true;
    });
    // do something when player/load/fulfilled is executed
    builder.addCase(loadCourse.fulfilled, (state, action) => {
      state.course = action.payload;
      state.isLoading = false;
    });
  },
});

export const player = playerSlice.reducer;

export const { play, next } = playerSlice.actions;
