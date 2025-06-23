import { Mail } from "lucide-react";
import getLanguageName from "../utils/getLanguageName";
import { Link } from "react-router";

const FriendCard = ({ friend }) => (
  <div className="bg-base-200 rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:shadow-xl transition-shadow">
    <img
      src={friend.profilePic || "/avatar.png"}
      alt={friend.fullName}
      className="w-16 h-16 rounded-full object-cover"
      onError={(e) => { e.currentTarget.src = "/avatar.png"; }}
    />
    <div className="flex-1">
      <div className="font-semibold text-xl text-neutral-content">{friend.fullName}</div>
      <div className="text-sm text-neutral-content/70">
        Native: {getLanguageName(friend.nativeLanguage)}
        {friend.learningLanguages?.length > 0 && ` | Learning: ${getLanguageName(friend.learningLanguages[0]?.code)}`}
      </div>
    </div>
    <Link
      to={`/chat/${friend._id}`}
      className="btn btn-outline btn-sm flex items-center gap-2"
    >
      <Mail className="w-5 h-5" /> Message
    </Link>
  </div>
);

export default FriendCard;