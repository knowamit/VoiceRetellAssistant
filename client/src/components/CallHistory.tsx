import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";
import { CallRecord } from "@shared/schema";

export function CallHistory() {
  const { data: callHistory, isLoading } = useQuery<CallRecord[]>({
    queryKey: ["/api/calls"],
  });

  return (
    <Card className="bg-white shadow rounded-lg mb-6">
      <div className="px-4 py-5 sm:px-6 border-b border-slate-200 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-semibold text-slate-800">Call History</h3>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</button>
      </div>
      <div className="divide-y divide-slate-200">
        {isLoading ? (
          <div className="p-6 text-center text-slate-500">Loading call history...</div>
        ) : !callHistory || callHistory.length === 0 ? (
          <div className="p-6 text-center text-slate-500">No call history available</div>
        ) : (
          callHistory.map((call) => (
            <div key={call.id} className="px-4 py-4 sm:px-6 hover:bg-slate-50">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-primary-600 truncate">{call.agentName}</p>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    call.status === "completed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {call.status === "completed" ? "Completed" : "Dropped"}
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-slate-500">
                    <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-slate-400" />
                    {call.duration}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-slate-500 sm:mt-0">
                  <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-slate-400" />
                  <p>{call.timestamp}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
