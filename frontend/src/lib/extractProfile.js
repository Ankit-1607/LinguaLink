export default function extractProfile(authUser) {
  let city = "", country = "";
  if (authUser?.location) {
    const [c, ctr] = authUser.location.split(",").map(s => s.trim());
    city = c || "";
    country = ctr || "";
  }
  return {
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguages: authUser?.learningLanguages || [],
    timeZone: authUser?.timeZone || "",
    availability: authUser?.availability || [],
    country,
    city,
    profilePic: authUser?.profilePic || ""
  };
}