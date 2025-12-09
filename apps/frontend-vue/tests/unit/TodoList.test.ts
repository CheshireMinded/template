import { mount } from "@vue/test-utils";
import TodoList from "../../src/components/TodoList.vue";

// Mock fetch
global.fetch = jest.fn();
// Mock window.confirm
window.confirm = jest.fn(() => true);

describe("<TodoList />", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    (window.confirm as jest.Mock).mockClear();
  });

  it("renders component", async () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({ todos: [], count: 0 })
      })
    );

    const wrapper = mount(TodoList);
    
    expect(wrapper.text()).toContain("Todo List");
  });

  it("renders todos after fetching", async () => {
    const mockTodos = [
      {
        id: "1",
        title: "Test Todo",
        description: "Test description",
        completed: false,
        createdAt: "2025-01-01",
        updatedAt: "2025-01-01"
      }
    ];

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("/api/v1/todos") && !url.includes("/api/v1/todos/")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ todos: mockTodos, count: 1 })
        });
      }
      return Promise.reject(new Error("Unexpected URL"));
    });

    const wrapper = mount(TodoList);

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(wrapper.text()).toContain("Test Todo");
  });

  it("creates a new todo when form is submitted", async () => {
    const wrapper = mount(TodoList);
    let fetchCallCount = 0;

    (global.fetch as jest.Mock).mockImplementation((url: string, options?: RequestInit) => {
      if (url.includes("/api/v1/todos") && options?.method === "POST") {
        const newTodo = {
          id: "new-id",
          title: "New Todo",
          description: "",
          completed: false,
          createdAt: "2025-01-01",
          updatedAt: "2025-01-01"
        };
        return Promise.resolve({
          ok: true,
          json: async () => ({ ok: true, todo: newTodo })
        });
      }
      if (url.includes("/api/v1/todos") && !url.includes("/api/v1/todos/") && !options) {
        fetchCallCount++;
        return Promise.resolve({
          ok: true,
          json: async () => ({ todos: fetchCallCount === 1 ? [] : [{ id: "new-id", title: "New Todo", completed: false, createdAt: "2025-01-01", updatedAt: "2025-01-01" }], count: fetchCallCount === 1 ? 0 : 1 })
        });
      }
      return Promise.reject(new Error("Unexpected URL"));
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));

    const titleInput = wrapper.find('input[placeholder*="title"]');
    const submitButton = wrapper.find('button:contains("Add Todo")');

    await titleInput.setValue("New Todo");
    await submitButton.trigger("click");

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/todos"),
      expect.objectContaining({ method: "POST" })
    );
  });

  it("toggles todo completion when checkbox is clicked", async () => {
    const mockTodos = [
      {
        id: "1",
        title: "Test Todo",
        description: "Test description",
        completed: false,
        createdAt: "2025-01-01",
        updatedAt: "2025-01-01"
      }
    ];

    (global.fetch as jest.Mock).mockImplementation((url: string, options?: RequestInit) => {
      if (url.includes("/api/v1/todos/1") && options?.method === "PUT") {
        return Promise.resolve({
          ok: true,
          json: async () => ({ ok: true, todo: { ...mockTodos[0], completed: true } })
        });
      }
      if (url.includes("/api/v1/todos") && !url.includes("/api/v1/todos/") && !options) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ todos: mockTodos, count: 1 })
        });
      }
      return Promise.reject(new Error("Unexpected URL"));
    });

    const wrapper = mount(TodoList);

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));

    const checkbox = wrapper.find('input[type="checkbox"]');
    await checkbox.trigger("change");

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/todos/1"),
      expect.objectContaining({ method: "PUT" })
    );
  });
});

