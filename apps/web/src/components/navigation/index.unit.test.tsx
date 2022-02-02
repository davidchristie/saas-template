import { render } from "@testing-library/react";
import { Navigation } from ".";

describe("<Navigation />", () => {
  it("matches snapshot", () => {
    const result = render(<Navigation />);
    expect(result.container.firstChild).toMatchSnapshot();
  });
});
