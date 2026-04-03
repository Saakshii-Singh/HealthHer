import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

const user=JSON.parse(localStorage.getItem("userInfo"));


    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    },[]);
return(
    <div className="p-10">
        <h1 className="text-xl font-bold">Welcome {user?.name}</h1>
        <p>Email:{user?.email}</p>
        <button
        onClick={()=>{
            localStorage.removeItem("userInfo");
            navigate("/login");
        }}
        className="mt-5 bg-red-500 text-white px-4 py-2">Logout</button>
    </div>
);
}
export default Dashboard;