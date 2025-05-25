import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Note from "../src/components/Note";

test("renders content", async () => {
  const note = {
    content: "Component testing is done with react-testing-library",
    important: true,
  };

  // render(<Note note={note} />);

  // const element = screen.getByText(
  //   "Component testing is done with react-testing-library"
  //  ,{ exact: false }
  // );
  // expect(element).toBeDefined();
  // screen.debug(element);
  // console.log(`---------`);

  /// or use this approach

  // const { container } = render(<Note note={note} />);

  // const div = container.querySelector(".note");
  // expect(div).toHaveTextContent(
  //   "Component testing is done with react-testing-library"
  // );
  ///////
  // screen.debug();

  //////////////// clicking a button
  const mockHandler = vi.fn();
  render(<Note note={note} toggleImportance={mockHandler} />);

  const user = userEvent.setup();
  const button = screen.getByText("make not important");
  await user.click(button);

  expect(mockHandler.mock.calls).toHaveLength(1);
});
