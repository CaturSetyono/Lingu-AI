import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InputBox } from "./InputBox";

describe("InputBox Component", () => {
  const mockOnChange = vi.fn();
  const mockOnClear = vi.fn();

  it("renders textarea with correct attributes", () => {
    render(<InputBox value="" onChange={mockOnChange} onClear={mockOnClear} />);

    const textarea = screen.getByRole("textbox", { name: /input text/i });
    expect(textarea).toBeInTheDocument();
  });

  it("displays character count", () => {
    render(
      <InputBox
        value="Hello world"
        onChange={mockOnChange}
        onClear={mockOnClear}
      />,
    );

    expect(screen.getByText(/11 \/ 5000/)).toBeInTheDocument();
  });

  it("calls onChange when text is entered", async () => {
    const user = userEvent.setup();
    render(<InputBox value="" onChange={mockOnChange} onClear={mockOnClear} />);

    const textarea = screen.getByRole("textbox", { name: /input text/i });
    await user.type(textarea, "Test text");

    expect(mockOnChange).toHaveBeenCalled();
  });

  it("shows clear button when value exists", () => {
    render(
      <InputBox
        value="Some text"
        onChange={mockOnChange}
        onClear={mockOnClear}
      />,
    );

    const clearButton = screen.getByRole("button", { name: /clear/i });
    expect(clearButton).toBeInTheDocument();
  });

  it("hides clear button when value is empty", () => {
    render(<InputBox value="" onChange={mockOnChange} onClear={mockOnClear} />);

    const clearButton = screen.queryByRole("button", { name: /clear/i });
    expect(clearButton).not.toBeInTheDocument();
  });

  it("calls onClear when clear button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <InputBox
        value="Some text"
        onChange={mockOnChange}
        onClear={mockOnClear}
      />,
    );

    const clearButton = screen.getByRole("button", { name: /clear/i });
    await user.click(clearButton);

    expect(mockOnClear).toHaveBeenCalled();
  });

  it("disables textarea when disabled prop is true", () => {
    render(
      <InputBox
        value="Some text"
        onChange={mockOnChange}
        onClear={mockOnClear}
        disabled={true}
      />,
    );

    const textarea = screen.getByRole("textbox", { name: /input text/i });
    expect(textarea).toBeDisabled();
  });
});
