import { useEffect, useState } from "react";

export default function MyPaginate({page,setPage,lastPage}){

    const calPageNumber = () => {
        const arrPage = [];
        const visible = 3;
        arrPage.push(1);

        if(page >= visible + 1){
            arrPage.push("...");
        }
        for(let i = Math.max(2, page - 1); i <= Math.min(page + 1,lastPage - 1); i++){
            arrPage.push(i);
        }
        
        if(page <= lastPage - visible){
                arrPage.push("...");
        }
        if (lastPage > 1){
            arrPage.push(lastPage);
        }
        return arrPage;
    }

    const pages = calPageNumber();
    useEffect(()=>{
        if(pages){
            //console.log(pages, page)
        }
    },[]);
    return (
        <>
        <div className="pagination">
            <button disabled={page === 1} onClick={()=>setPage(p => p - 1)}>Previous</button>
            {pages.map((each, index)=>
                each === "..."? (<span key = {index + "eclip"} className="ellipsis">...</span>)
                :(<button key={each} className={each === page?"active": ""}
                    onClick={()=>setPage(each)}>
                    {each}
                </button>)
            )}
            <button disabled={page === lastPage} onClick={()=>setPage(p => p + 1)}>next</button>
        </div>
        </>
    )

}