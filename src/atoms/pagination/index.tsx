export function Pagination() {
  return (
    <div className="flex items-center justify-between py-3 ">
      <div className="flex flex-1 justify-between">
        <a
          href="#"
          className=" relative inline-flex items-center rounded-md py-2 text-sm font-medium text-dark-purple"
        >
          <span className=" mr-0.5 text-dark-purple">{'<'}</span>
          Previous
        </a>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <nav
            className="relative z-0 inline-flex -space-x-px rounded-md"
            aria-label="Pagination"
          >
            {/* <a
              href="#"
              className="relative inline-flex items-center px-2 py-2 rounded-l-md bg-white text-sm font-medium text-gray "
            >
              <span className="sr-only">Previous</span> */}
            {/* <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" /> */}
            {/* </a> */}
            {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray " */}
            <a
              href="#"
              aria-current="page"
              className="relative z-10 inline-flex items-center p-2 font-medium text-gray"
            >
              1
            </a>
            <a
              href="#"
              className="   relative inline-flex items-center p-2 font-medium text-gray"
            >
              2
            </a>
            <a
              href="#"
              className="  relative  items-center p-2 font-medium text-gray"
            >
              3
            </a>
            <span className=" relative inline-flex items-center p-2   font-medium">
              ...
            </span>
            <a
              href="#"
              className="  relative  items-center p-2 font-medium text-gray"
            >
              8
            </a>
            <a
              href="#"
              className="   relative inline-flex items-center p-2 font-medium text-gray"
            >
              9
            </a>
            <a
              href="#"
              className="   relative inline-flex items-center p-2 font-medium text-gray"
            >
              10
            </a>
            {/* <a
              href="#"
              className="relative inline-flex items-center px-2 py-2 rounded-r-md   font-medium text-gray "
            >
              <span className="sr-only">Next</span> */}
            {/* <ChevronRightIcon className="h-5 w-5" aria-hidden="true" /> */}
            {/* </a> */}
          </nav>
        </div>
      </div>
      <div className="flex flex-1 justify-end">
        <a
          href="#"
          className=" relative inline-flex rounded-md py-2 text-sm font-medium text-dark-purple"
        >
          Next
          <span className=" ml-0.5 text-dark-purple">{'>'}</span>
        </a>
      </div>
    </div>
  );
}
