import { beforeEach, describe, expect, it } from "vitest";
import { useStore } from ".";

const courseMock = {
  id: 1,
  modules: [
    {
      id: 1,
      title: "Iniciando com React",
      lessons: [
        { id: "Jai8w6K_GnY", title: "CSS Modules", duration: "13:45" },
        { id: "w-DW4DhDfcw", title: "Estilização do Post", duration: "10:05" },
      ],
    },
    {
      id: 2,
      title: "Estrutura da aplicação",
      lessons: [
        { id: "gE48FQXRZ_o", title: "Componente: Comment", duration: "13:45" },
        { id: "Ng_Vk4tBl0g", title: "Responsividade", duration: "10:05" },
      ],
    },
  ],
};

const initialState = useStore.getState();

describe("zustand store", () => {
  beforeEach(() => {
    useStore.setState(initialState);
  });

  it("Should be able to play", () => {
    const { play } = useStore.getState();

    play({
      moduleIndex: 1,
      lessonIndex: 2,
    });

    const { currentModuleIndex, currentLessonIndex } = useStore.getState();

    expect(currentModuleIndex).toEqual(1);
    expect(currentLessonIndex).toEqual(2);
  });

  it("should be able to play next video automatically", () => {
    useStore.setState({ course: courseMock });

    const { next } = useStore.getState();

    next();

    const { currentModuleIndex, currentLessonIndex } = useStore.getState();

    expect(currentModuleIndex).toEqual(0);
    expect(currentLessonIndex).toEqual(1);
  });

  it("Should be able to jump to the next module automatically", () => {
    useStore.setState({ course: courseMock });

    const { next } = useStore.getState();
    useStore.setState({
      currentLessonIndex: 1,
    });

    next();

    const { currentModuleIndex, currentLessonIndex } = useStore.getState();

    expect(currentModuleIndex).toEqual(1);
    expect(currentLessonIndex).toEqual(0);
  });

  it("Should not update the current module and lesson index if there is not next lesson available", () => {
    useStore.setState({ course: courseMock });

    const { next } = useStore.getState();
    useStore.setState({
      currentModuleIndex: 1,
      currentLessonIndex: 1,
    });

    next();

    const { currentModuleIndex, currentLessonIndex } = useStore.getState();

    expect(currentModuleIndex).toEqual(1);
    expect(currentLessonIndex).toEqual(1);
  });
});
