import { useState,useEffect } from "react";
import axios from "axios";

function PeriodTracker() {
    const [lastDate, setLastDate] = useState("");
    const [cycleLength, setCycleLength] = useState(28);
    const [results, setResults] = useState(null);
    const [history, setHistory] = useState([]);

    const user= JSON.parse(localStorage.getItem("userInfo"));

    useEffect(() => {
        const fetchData = async () => {
            try{
                const {data}=await axios.get(
                      `http://localhost:5000/api/period/${user._id}`
                );
                setHistory(data);
            }catch(error){
                console.error("Error fetching period history:", error);
            }
        };

        if(user)fetchData();
    },[]);

    const calcultePeriod=async()=>{
        if(!lastDate)return;

        const last=new Date(lastDate);
        const next=new Date(last);
        next.setDate(next.getDate()+Number(cycleLength));

        const fertileStart=new Date(last);
        fertileStart.setDate(fertileStart.getDate()+12);
        const fertileEnd=new Date(last);
        fertileEnd.setDate(fertileEnd.getDate()+16);

        setResults({
            nextPeriod: next.toDateString(),
            fertileWindow: `${fertileStart.toDateString()} - ${fertileEnd.toDateString()}`
        });

        await axios.post("http://localhost:5000/api/period",{
            userId: user._id,
            lastDate,
            cycleLength
        });
    };

    return (
        <div className="flex justify-center mt-10">
            <div className="bg-white/70 p-6 rounded-xl shadow-xl w-96 text-center">
                <h2 className="text-2xl font-bold text-pink-500 mb-4">Period Tracker</h2>

                <input 
                type="date"
                className="border p-2 mb-3 w-full rounded"
                value={lastDate}
                onChange={(e)=>setLastDate(e.target.value)}
                 />
                <input
                type="number"
                className="border p-2 mb-3 w-full rounded"
                value={cycleLength}
                onChange={(e)=>setCycleLength(e.target.value)}
                />
                <button 
                className="bg-pink-500 text-white px-4 py-2 rounded"
                onClick={calcultePeriod}
                >
                Predict
                </button>
                {results && (
                    <div className="mt-4 text-left">
                        <p><strong>Next Period:</strong> {results.nextPeriod}</p>
                        <p><strong>Fertile Window:</strong> {results.fertile}</p>
                    </div>
                )}
                <div className="mt-5 text-left">
                    <h3 className="font-bold text-pink-500">Period History</h3>

                    {history.map((item,i)=>(
                        <p key={i}>
                            {new Date(item.lastDate).toDateString()} Cycle: {item.cycleLength})
                        </p>
                    ))}
                    
            </div>
        </div>
        </div>
    );
}
export default PeriodTracker;