import { mount } from "@vue/test-utils";
import App from "../../src/App.vue";

describe("<App />", () => {
  it("renders root component", () => {
    const wrapper = mount(App);
    const text = wrapper.text();
    expect(text).toContain("Vue Frontend");
    expect(text).toContain("Hello from Vue frontend!");
  });
});

