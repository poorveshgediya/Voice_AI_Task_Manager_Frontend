import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="flex items-start justify-between bg-white dark:bg-slate-900 p-4 rounded shadow-sm border border-slate-100 dark:border-slate-800 animate-pulse">
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-3/4"></div>
        <div className="space-y-2">
          <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-md w-full"></div>
          <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-md w-5/6"></div>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-md w-12 mt-2"></div>
      </div>
      <div className="ml-4 mt-1">
        <div className="size-5 bg-slate-100 dark:bg-slate-800 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
