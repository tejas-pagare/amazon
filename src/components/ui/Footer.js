export function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-slate-900 w-full py-12 mt-auto border-t border-slate-200 dark:border-slate-800">
      <div className="flex flex-col items-center gap-6 px-4 max-w-7xl mx-auto">
        <div className="bg-slate-200 dark:bg-slate-800 h-px w-full"></div>
        <div className="flex flex-wrap justify-center gap-8">
          <a className="text-slate-500 dark:text-slate-400 text-xs font-['Inter'] uppercase tracking-widest transition-colors hover:text-orange-500 opacity-80 hover:opacity-100" href="#">Conditions of Use</a>
          <a className="text-slate-500 dark:text-slate-400 text-xs font-['Inter'] uppercase tracking-widest transition-colors hover:text-orange-500 opacity-80 hover:opacity-100" href="#">Privacy Notice</a>
          <a className="text-slate-500 dark:text-slate-400 text-xs font-['Inter'] uppercase tracking-widest transition-colors hover:text-orange-500 opacity-80 hover:opacity-100" href="#">Your Ads Privacy Choices</a>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-['Inter'] uppercase tracking-widest">© 1996-2024, Amazon, Inc. or its affiliates</p>
      </div>
    </footer>
  );
}
