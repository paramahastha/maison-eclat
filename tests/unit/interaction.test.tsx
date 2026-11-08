import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NotesExplorer } from "@/components/product/NotesExplorer";
import { FragranceProvider } from "@/components/product/FragranceProvider";
import { CollectionSection } from "@/components/sections/CollectionSection";
import { fragrances } from "@/data/fragrances";

describe("Fragrance exploration", () => {
  it("keeps note tab focus and content synchronized through arrow/Home/End keys", () => {
    render(<NotesExplorer fragrance={fragrances[0]} />);
    const top = screen.getByRole("tab", { name: /top/i });
    top.focus();
    fireEvent.keyDown(top, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: /heart/i })).toHaveFocus();
    expect(
      within(screen.getByRole("tabpanel")).getByText("Iris & Incense"),
    ).toBeVisible();
    fireEvent.keyDown(document.activeElement!, { key: "End" });
    expect(
      within(screen.getByRole("tabpanel")).getByText("Vetiver & Amberwood"),
    ).toBeVisible();
    fireEvent.keyDown(document.activeElement!, { key: "Home" });
    expect(top).toHaveFocus();
    expect(top).toHaveAttribute("aria-selected", "true");
  });
  it("switches the palette, fragrance, notes and destination together", () => {
    render(
      <FragranceProvider>
        <CollectionSection />
      </FragranceProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: /neroli/i }));
    expect(screen.getByRole("button", { name: /neroli/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("heading", { name: "Neroli" })).toBeVisible();
    expect(
      screen.getByRole("link", { name: /Explore Neroli/ }),
    ).toHaveAttribute("href", "/fragrances/neroli-02");
    expect(document.querySelector("#collection")).toHaveAttribute(
      "data-variant",
      "neroli",
    );
    expect(document.querySelector(".collection-notes")).toHaveTextContent(
      "Jasmine",
    );
    fireEvent.click(screen.getByRole("button", { name: /santal/i }));
    expect(screen.getByRole("heading", { name: "Santal" })).toBeVisible();
    expect(screen.getByRole("button", { name: /neroli/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(
      screen.getByRole("link", { name: /Explore Santal/ }),
    ).toHaveAttribute("href", "/fragrances/santal-03");
  });
});
