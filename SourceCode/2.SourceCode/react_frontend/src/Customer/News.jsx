// src/pages/Customer/News.jsx
import "../css/home/news.css"
import { fetchSystemNotification } from "../apiComponent/apiService";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/UserContext";
import { useState } from "react";

export default function News() {
  const queryClient = useQueryClient();
  const [visibleCount, setVisibleCount] = useState(3);
  const {user, navigate, formatDate, convertToDateTimeLocal} = useContext(AuthContext);

  const queriesResults = useQueries({
        queries:[
          { queryKey: ["SysNotification"],
            queryFn: fetchSystemNotification,
            refetchInterval: 1000 * 60,
          }
        ]
  });

  const SysNotificationData = queriesResults[0];

  useEffect(()=>{
    if(SysNotificationData?.data){
      console.log(SysNotificationData.data)
    }
  }
  , [SysNotificationData.data]);

  return (
    <section className="news p-4 bg-light mt-4">
      <h3>📰 Latest News</h3>
      <div className="list-group">
        {SysNotificationData.isLoading? <div className="spinner-border"></div>:
          <>
            {SysNotificationData.data.filter(each=>{
              return each.type === "system" && each.status === "published"
            }).slice(0, visibleCount).map((eachNew)=>{
              return (
              <div className="list-group-item">
                <h5>{eachNew.title}</h5>
                <small className="text-muted">
                {formatDate(eachNew.created_at)}  — LegalEase
                </small>
                <p>{eachNew.content}</p>
              </div>)
            })
          } 
          {visibleCount <
            SysNotificationData.data.filter(
              each => each.type === "system" && each.status === "published"
            ).length && (
            <button
              className="load mt-3"
              onClick={() => setVisibleCount(visibleCount + 3)}
            >
              Load More <i className="bx bx-sync"></i>
            </button>
          )}
          </>
        }
      </div>
      
      
    </section>
  );
}