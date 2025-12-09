import { mount } from "@vue/test-utils";
import App from "../../src/App.vue";

describe("<App />", () => {
  it("renders root component", () => {
    const wrapper = mount(App);
    expect(wrapper.text().toLowerCase()).toContain("app");
  });
});

