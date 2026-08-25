"use client";

/**
 * Placeholder shown while a project's detail is being fetched for the overlay.
 *
 * It mirrors ProjectDetailContent's structure block for block — carousel,
 * title, description, meta grid — at the same sizes and spacing. That is the
 * point of a stencil rather than a spinner or a line of text: the panel is
 * already the right shape, so when the real content arrives it replaces the
 * placeholder without the layout jumping.
 *
 * Text lines are deliberately uneven. A stack of equal-width bars reads as
 * bars; ragged ones read as prose.
 */
export function ProjectDetailStencil() {
  return (
    <div className="project-detail" aria-hidden="true">
      {/* carousel — matches ProjectCarousel's aspect and dot row */}
      <div className="w-full mb-8 tablet:mb-12">
        <div className="w-full aspect-[16/10] block-radius stencil" />
        <div className="flex items-center justify-center gap-2 pt-4">
          {[28, 6, 6, 6].map((w, i) => (
            <div key={i} className="h-1.5 rounded-full stencil" style={{ width: w }} />
          ))}
        </div>
      </div>

      {/* title — project-detail-h1 is 20px, so a 20px bar sits where it will */}
      <div className="pb-3 tablet:pb-4">
        <div className="h-5 rounded stencil" style={{ width: "58%" }} />
      </div>

      <div className="flex flex-col gap-8 tablet:gap-12 pb-8 tablet:pb-12">
        {/* description */}
        <div className="flex flex-col gap-2.5">
          {["100%", "96%", "99%", "72%"].map((w, i) => (
            <div key={i} className="h-3 rounded stencil" style={{ width: w }} />
          ))}
        </div>

        {/* meta strip — same 3-up grid, each a small label over a value */}
        <div className="grid grid-cols-1 tablet:grid-cols-3 gap-6 tablet:gap-10">
          {[
            { label: 38, value: "78%" },
            { label: 32, value: "62%" },
            { label: 48, value: "54%" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-2.5 rounded stencil" style={{ width: item.label }} />
              <div className="h-3.5 rounded stencil" style={{ width: item.value }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
