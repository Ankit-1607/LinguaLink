import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, cancelFriendRequest, getFriendRequests, rejectFriendRequest } from "../lib/api.js";
import { useState } from "react";
import getLanguageName from "../utils/getLanguageName.js";

const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const [cancelling, setCancelling] = useState(null);

  const { data: friendRequests, isLoading: isLoadingFriendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests, // this has all the requests sent to and by user
  });

  const acceptMutation = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    }
  });
  const rejectMutation = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["friendRequests"] }),
  });
  const cancelMutation = useMutation({
    mutationFn: cancelFriendRequest,
    onMutate: (id) => setCancelling(id),
    onSettled: () => setCancelling(null),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["friendRequests"] }),
  });

  const incomingRequests = friendRequests?.incomingRequests || [];
  const sentRequests = friendRequests?.sentRequests || [];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Notifications</h1>

      {/* Received Friend Requests */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Received Friend Requests</h2>
        {isLoadingFriendRequests ? (
          <div className="flex justify-center"><span className="loading loading-spinner loading-lg" /></div>
        ) : incomingRequests.length === 0 ? (
          <div className="text-neutral-content/70">No friend requests received.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {incomingRequests.map((req) => (
              <div key={req._id} className="bg-base-200 rounded-xl p-4 flex items-center justify-between shadow">
                <div className="flex items-center gap-4">
                  <img
                    src={req.sender.profilePic || "/avatar.png"}
                    alt={req.sender.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-lg">{req.sender.fullName}</div>
                    <div className="text-sm text-neutral-content/70">
                      Native: {req.sender.nativeLanguage}
                      {req.sender.learningLanguages?.length > 0 &&
                        ` | Learning: ${getLanguageName(req.sender.learningLanguages[0]?.code)}`}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-primary btn-sm"
                    disabled={acceptMutation.isLoading}
                    onClick={() => acceptMutation.mutate(req._id)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={rejectMutation.isLoading}
                    onClick={() => rejectMutation.mutate(req._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sent Friend Requests */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Requests You Sent</h2>
        {isLoadingFriendRequests ? (
          <div className="flex justify-center"><span className="loading loading-spinner loading-lg" /></div>
        ) : sentRequests.length === 0 ? (
          <div className="text-neutral-content/70">No friend requests sent.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {sentRequests.map((req) => (
              <div key={req._id} className="bg-base-200 rounded-xl p-4 flex items-center justify-between shadow">
                <div className="flex items-center gap-4">
                  <img
                    src={req.recipient.profilePic || "/avatar.png"}
                    alt={req.recipient.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-lg">{req.recipient.fullName}</div>
                    <div className="text-sm text-neutral-content/70">
                      {req.status === "pending" && "Your request is pending"}
                      {req.status === "accepted" && (
                        <span>
                          {req.recipient.fullName} has accepted your request
                        </span>
                      )}
                      {req.status === "rejected" && (
                        <span>
                          {req.recipient.fullName} has rejected your request
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {req.status === "pending" && (
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={cancelling === req._id || cancelMutation.isLoading}
                    onClick={() => cancelMutation.mutate(req._id)}
                  >
                    {cancelling === req._id ? "Cancelling..." : "Cancel Request"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default NotificationsPage;