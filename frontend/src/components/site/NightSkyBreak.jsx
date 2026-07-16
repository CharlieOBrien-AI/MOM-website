/** Full-width night-sky artwork — plain image, no filter, no zoom, no crop. */
export default function NightSkyBreak() {
  return (
    <section
      data-testid="night-sky-section"
      style={{ background: "#06060a", lineHeight: 0 }}
    >
      <img
        src="/images/night-sky.jpg"
        alt=""
        draggable={false}
        className="block h-auto w-full select-none"
      />
    </section>
  );
}
