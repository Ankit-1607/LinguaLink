import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOutFriendGoingRequests, getRecommendedUsers, getUserFriends, sendFriendRequest } from "../lib/api.js";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { UserPlus, Check, Mail, User2, Link, UsersIcon } from "lucide-react";
import FriendCard from "../components/FriendCard.jsx";
import getLanguageName from "../utils/getLanguageName.js";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outGoingRequestsIDs, setOutGoingRequestsIDs] = useState(new Set());
  const [showCount, setShowCount] = useState(10);
  const [showFriendsCount, setShowFriendsCount] = useState(5);

  const { data: friends = [], isLoading: isLoadingFriends } = useQuery({
    queryKey: ['friends'],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: isLoadingRecommendedUsers } = useQuery({
    queryKey: ['users'],
    queryFn: getRecommendedUsers,
  });

  const { data: outGoingFriendRequests = [] } = useQuery({
    queryKey: ['outGoingFriendRequests'],
    queryFn: getOutFriendGoingRequests,
  });

  const { mutate: sendRequestMutation, isLoading: isSending } = useMutation({
    mutationKey: ['sendRequestMutation'],
    mutationFn: sendFriendRequest,
    onMutate: (userId) => {
      setOutGoingRequestsIDs(prev => new Set(prev).add(userId));
    },
    onSuccess: () => {
      toast.success('Friend Request sent successfully');
      queryClient.invalidateQueries({ queryKey: ['outGoingFriendRequests'] });
    },
    onError: (error, userId) => {
      setOutGoingRequestsIDs(prev => {
        const copy = new Set(prev);
        copy.delete(userId);
        return copy;
      });
      
      toast.error(error?.response?.data?.message || 'Failed to send request');
    }
  });

  useEffect(() => {
    const ids = new Set(
      outGoingFriendRequests.map(req =>
        req.recipient._id // handle populated data
      )
    );
    setOutGoingRequestsIDs(ids);
  }, [outGoingFriendRequests]);

  const UserCard = ({ user}) => {
    const isRequested = outGoingRequestsIDs.has(user._id);
    return (
      <div className="bg-base-200 rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <img
              src={user.profilePic || "/avatar.png"}
              alt={user.fullName}
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => { e.currentTarget.src = "/avatar.png"; }}
            />
            <div>
              <div className="font-semibold text-xl text-neutral-content">{user.fullName}</div>
              <div className="text-sm text-neutral-content/70">
                {user.location && `${user.location} | `}
                Native: {getLanguageName(user.nativeLanguage)}
                {user.learningLanguages?.length > 0 && ` | Learning: ${getLanguageName(user.learningLanguages[0]?.code)}`}
              </div>
            </div>
          </div>
          <p className="text-sm text-neutral-content/80 mb-4">{user.bio}</p>
        </div>
        <button
          className={`btn btn-primary btn-block flex items-center justify-center gap-2 ${isRequested ? 'btn-disabled' : ''}`}
          disabled={isRequested || isSending}
          onClick={() => sendRequestMutation(user._id)}
        >
          {isRequested ? <><Check className="w-5 h-5" /> Request Sent</> : <><UserPlus className="w-5 h-5" /> Send Request</>}
        </button>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
          <a href="/notifications" className="flex items-center text-primary font-semibold gap-1">
            <User2 className="w-5 h-5" /> Friend Requests
          </a>
        </div>

        <section>
          {isLoadingFriends ? (
            <div>
              <span className="loading loading-spinner loading-lg"/>
            </div>
          ) : friends.length === 0 ? (
            <div className="text-neutral-content/70">Make friends to view them here.</div>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                {friends.slice(0, showFriendsCount).map(friend => <FriendCard key={friend._id} friend={friend} />)}
              </div>
              {friends.length > showFriendsCount && (
                <div className="flex justify-center mt-4">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setShowFriendsCount(prev => prev + 5)}
                  >
                    Show More
                  </button>
                </div>
              )}
            </>
          )}
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4 text-neutral-content">Other People Here</h2>
          {isLoadingRecommendedUsers ? (
            <div>
              <span className="loading loading-spinner loading-lg"/>
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="text-neutral-content/70">Looks like no one is here.</div>
          ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedUsers.slice(0, showCount).map(user => (
                <UserCard key={user._id} user={user} />
              ))}
            </div>
            {recommendedUsers.length > showCount && (
              <div className="flex justify-center mt-6">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setShowCount(prev => prev + 10)}
                >
                  Show More
                </button>
              </div>
            )}
          </>
        )}
      </section>        
      </div>
    </div>
  );
};

export default HomePage;
