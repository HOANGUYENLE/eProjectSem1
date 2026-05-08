export default function RatingStar({ratingStar}){
    const full = Math.floor(ratingStar);
    const half = ratingStar % 1 >= 0.5;
    const empty = (5 - full - (half ? 1 : 0));

    return (
        <div className="star text-warning">
        {Array(full).fill().map((each, index)=>{
            return <i className="bi bi-star-fill" key={index}></i>
        })}
        {half && <i className="bi bi-star-half"></i>}
        {Array(empty).fill().map((each, index)=>{
            return <i className="bi bi-star" key={index}></i>
        })}
        </div>
    )
}