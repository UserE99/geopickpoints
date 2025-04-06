import React from "react";
import ReactPaginate from "react-paginate";
import "../layout/css/pagination.css";
import left_arrow from "../layout/image/arrow-left-circle.svg";
import right_arrow from "../layout/image/arrow-right-circle.svg";
interface PaginationProps {
    pageCount: number;
    onPageChange: (selectedItem: { selected: number }) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pageCount, onPageChange }) => {
    return (
        <ReactPaginate
            previousLabel={
                <img
                    src={left_arrow}
                    alt="Previous"
                    style={{ width: "20px", height: "20px", margin: "0.5rem" }}
                />
            }
            nextLabel={
                <img
                    src={right_arrow}
                    alt="Next"
                    style={{ width: "20px", height: "20px", margin: "0.5rem" }}
                />
            }
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={onPageChange}
            containerClassName={"pagination"}
            activeClassName={"active"}
            previousClassName={"page-item"}
            nextClassName={"page-item"}
            disabledClassName={"disabled"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
        />
    );
};

export default Pagination;
