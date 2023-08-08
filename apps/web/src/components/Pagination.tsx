import React, { useState, useEffect } from "react";

const usePagination = ({
  totalRows,
  rowsPerPage,
}: {
  totalRows: number;
  rowsPerPage: number;
}) => {
  // Calculating max number of pages
  const noOfPages = Math.ceil(totalRows / rowsPerPage);

  // State variable to hold the current page. This value is
  // passed to the callback provided by the parent
  const [currentPage, setCurrentPage] = useState(1);

  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoNext, setCanGoNext] = useState(true);

  useEffect(() => {
    if (noOfPages === currentPage) {
      setCanGoNext(false);
    } else {
      setCanGoNext(true);
    }
    if (currentPage === 1) {
      setCanGoBack(false);
    } else {
      setCanGoBack(true);
    }
  }, [noOfPages, currentPage]);

  // Onclick handlers for the butons
  const onNextPage = () => setCurrentPage(currentPage + 1);
  const onPrevPage = () => setCurrentPage(currentPage - 1);
  const onPageSelect = (pageNo) => setCurrentPage(pageNo);

  return {
    currentPage,
    onNextPage,
    onPrevPage,
    onPageSelect,
    canGoBack,
    canGoNext,
    setCurrentPage,
  };
};

export default usePagination;
