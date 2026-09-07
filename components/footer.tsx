export function Footer() {
  return (
    <footer className="px-6 pb-10 pt-8 sm:px-10 lg:px-14">
      <div className="flex flex-col gap-10 border-t border-foreground/15 pt-8 sm:flex-row sm:items-start sm:justify-between">
        <a href="#top" className="text-[13px] tracking-[0.32em]">
          ATERRA
        </a>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.2em]">
            <li>
              <a href="#projects" className="nav-link">
                Projects
              </a>
            </li>
            <li>
              <a href="#studio" className="nav-link">
                Studio
              </a>
            </li>
            <li>
              <a href="#contact" className="nav-link">
                Contact
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="nav-link"
              >
                Instagram
              </a>
            </li>
          </ul>
        </nav>
        <p className="text-[11px] uppercase tracking-[0.2em] text-foreground/55">
          Palm Beach / Miami
        </p>
      </div>
    </footer>
  );
}
