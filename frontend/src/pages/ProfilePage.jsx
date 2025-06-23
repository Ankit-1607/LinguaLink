import { useState, useEffect, useRef } from "react";
import useAuthUser from "../hooks/useAuthUser.js";
import { updateProfile } from "../lib/api.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import languagesData from "../data/languages.json";
import countriesAndCities from "../data/countriesAndCities.json";
import { ShipWheelIcon, X , LoaderIcon, HomeIcon,} from "lucide-react";
import formatDate from "../utils/formatDate.js";
import extractProfile from "../lib/extractProfile.js";
import themeStore from "../lib/themeStore.js";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const levels = ["beginner", "intermediate", "advanced", "native"];

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const [timezones, setTimezones] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [cities, setCities] = useState([]);
  const [langDropdown, setLangDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const [hasModifiedProfile, setHasModifiedProfile] = useState(false);
  const {theme} = themeStore();

  // Use utility function for initial state
  const initialProfile = extractProfile(authUser);
  const initialProfileRef = useRef(initialProfile);
  const [userProfile, setUserProfile] = useState(initialProfile);

  // Load countries and timezones once
  useEffect(() => {
    setCountryList(countriesAndCities);
    setTimezones(Intl.supportedValuesOf("timeZone"));
  }, []);

  // Set cities and fix city value if needed
  useEffect(() => {
    const selected = countryList.find(c => c.name === userProfile.country);
    setCities(selected ? selected.cities : []);
    if (selected && !selected.cities.includes(userProfile.city)) {
      setUserProfile(prev => ({ ...prev, city: "" }));
    }
  }, [userProfile.country, countryList]);

  // Restore country/city if present in authUser (on mount or authUser change)
  useEffect(() => {
    if (authUser?.country && countryList.length > 0) {
      const selectedCountry = countryList.find(c => c.name === authUser.country);
      if (selectedCountry) {
        setCities(selectedCountry.cities);
        setUserProfile(prev => ({
          ...prev,
          country: authUser.country,
          city: authUser.city
        }));
      }
    }
  }, [authUser, countryList]);

  const queryClient = useQueryClient();
  const { mutate: profileCompletionMutation, isPending } = useMutation({
    mutationKey: ["profileCompletion"],
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      initialProfileRef.current = { ...userProfile }; // smthng updated or not check
      setHasModifiedProfile(false);
    },
    onError: (error) => { 
      toast.error(
        `Failed to update profile: ${error?.response?.data?.message}` ||
        "Failed to update profile. Please try again."
      );
    }
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Combining city and country into location string for backend
    profileCompletionMutation({
      ...userProfile,
      location: userProfile.city && userProfile.country
        ? `${userProfile.city}, ${userProfile.country}`
        : "",
    });
  };

  const handleChange = (e) => { // handle input changes
    const { name, value } = e.target;
    setUserProfile(prev => ({ ...prev, [name]: value }));
    setHasModifiedProfile(true);
  };

  // Learning languages: add, remove, update level/since
  const addLanguage = (code) => {
    if (!userProfile.learningLanguages.some(l => l.code === code)) {
      setUserProfile(prev => ({
        ...prev,
        learningLanguages: [...prev.learningLanguages, { code, level: 'beginner', learningSince: new Date().toISOString().split('T')[0] }]
      }));
      setHasModifiedProfile(true);
    }
  };
  const removeLanguage = (code) => {
    setUserProfile(prev => ({
      ...prev,
      learningLanguages: prev.learningLanguages.filter(l => l.code !== code)
    }));
    setHasModifiedProfile(true);
  };
  const updateLanguageDetail = (code, field, value) => {
    setUserProfile(prev => ({
      ...prev,
      learningLanguages: prev.learningLanguages.map(l => l.code === code ? { ...l, [field]: value } : l)
    }));
    setHasModifiedProfile(true);
  };

  // Availability: add/remove day slots
  const toggleAvailability = (day) => {
    const exists = userProfile.availability.some(a => a.dayOfWeek === day);
    let newAvail;
    if (exists) {
      newAvail = userProfile.availability.filter(a => a.dayOfWeek !== day);
    } else {
      newAvail = [...userProfile.availability, { dayOfWeek: day, from: '09:00', to: '17:00' }];
    }
    setUserProfile(prev => ({ ...prev, availability: newAvail }));
    setHasModifiedProfile(true);
  };
  const updateAvailability = (day, field, value) => {
    setUserProfile(prev => ({
      ...prev,
      availability: prev.availability.map(a => a.dayOfWeek === day ? { ...a, [field]: value } : a)
    }));
    setHasModifiedProfile(true);
  };

  const generateRandomAvatar = async () => {
    // Using Dicebear API to generate random avatar
    const seed = Math.floor(Math.random() * 100000);
    const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;

    try {
      // Preload the image using JS Image object
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.src = avatarUrl;
        img.onload = resolve;
        img.onerror = reject;
      });

      // Only update after successful load
      setUserProfile(prev => ({ ...prev, profilePic: avatarUrl }));
      setHasModifiedProfile(true);
    } catch (error) {
      toast.error("Failed to load avatar. Try again.");
    }
  };

  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUserProfile(prev => ({ ...prev, profilePic: reader.result }));
        setHasModifiedProfile(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-base-200" data-theme={theme}>
      {/* {authUser?.hasCompletedProfile && (
        <a href="/" className="fixed top-6 left-6 text-primary hover:text-primary-focus transition-colors">
          <HomeIcon className="w-8 h-8" />
        </a>
      )} */}
      <div className="max-w-3xl mx-auto bg-base-100 rounded-xl shadow-md p-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">My Profile</h2>
          <img src={userProfile.profilePic || '/avatar.png'} alt="Profile" className="w-24 h-24 rounded-full object-cover mb-4" />
          <div className="flex space-x-4">
            <button className="btn btn-primary" onClick={generateRandomAvatar}>Random Avatar</button>
            <button className="btn btn-outline" onClick={handleUploadClick}>Upload Picture</button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="label">Full Name</label>
            <input type="text" name="fullName" value={userProfile.fullName} onChange={handleChange}
              className="input input-bordered w-full" required />
          </div>
          {/* Bio */}
          <div>
            <label className="label">Bio</label>
            <textarea name="bio" value={userProfile.bio} onChange={handleChange}
              className="textarea textarea-bordered w-full" rows="3"></textarea>
          </div>
          {/* Native Language */}
          <div>
            <label className="label">Native Language</label>
            <input type="text" name="nativeLanguage" value={userProfile.nativeLanguage} onChange={handleChange}
              className="input input-bordered w-full" required />
          </div>

          {/* Learning Languages */}
          <div>
            <label className="label">Learning Languages</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
              {userProfile.learningLanguages.map(lang => {
                const data = languagesData.find(l => l["1"] === lang.code) || {};
                return (
                  <div key={lang.code} className="card bg-base-100 shadow-lg p-4 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-lg">{data.local || lang.code}</span>
                      <button type="button" onClick={() => removeLanguage(lang.code)}><X /></button>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <select value={lang.level} onChange={e => updateLanguageDetail(lang.code, 'level', e.target.value)} className="select select-bordered">
                        {levels.map(lv => <option key={lv} value={lv}>{lv}</option>)}
                      </select>
                      <input
                        type="date"
                        value={formatDate(lang.learningSince)}
                        onChange={e => updateLanguageDetail(lang.code, 'learningSince', e.target.value)}
                        className="input input-bordered"
                      />

                    </div>
                  </div>
                );
              })}
            </div>
                                                  {/* Language Dropdown */}
            <div className="relative">
              <button type="button" className="btn btn-outline w-full" onClick={() => setLangDropdown(!langDropdown)}>
                Choose Language
              </button>
              {langDropdown && (
                <div className="absolute z-10 mt-2 bg-base-100 border rounded w-full max-h-48 overflow-y-auto shadow-lg">
                  {languagesData.map(l => (
                    <button key={l["1"]} className="w-full text-left px-4 py-2 hover:bg-base-300" onClick={() => addLanguage(l["1"])}>
                      {l.local} ({l.name})
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="label">Availability</label>
            <div className="flex space-x-2 mb-2">
              {daysOfWeek.map(day => {
                const selected = userProfile.availability.some(a => a.dayOfWeek === day);
                return (
                  <button
                    key={day}
                    type="button"
                    className={`btn btn-sm ${selected ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => toggleAvailability(day)}
                  >{day}</button>
                );
              })}
            </div>
            {userProfile.availability.map(a => (
              <div key={a.dayOfWeek} className="flex items-center space-x-2 mb-1">
                <span className="w-12">{a.dayOfWeek}</span>
                <input
                  type="time"
                  value={a.from}
                  onChange={e => updateAvailability(a.dayOfWeek, 'from', e.target.value)}
                  className="input input-bordered"
                />
                <span>to</span>
                <input
                  type="time"
                  value={a.to}
                  onChange={e => updateAvailability(a.dayOfWeek, 'to', e.target.value)}
                  className="input input-bordered"
                />
              </div>
            ))}
          </div>
          
          <div>
            <label className="label">Time Zone</label>
            <select name="timeZone" value={userProfile.timeZone} onChange={handleChange}
              className="select select-bordered w-full" required>
              <option value="" disabled>Select Timezone</option>
              {timezones.map(zone => <option key={zone} value={zone}>{zone}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Country</label>
            <select name="country" value={userProfile.country} onChange={handleChange}
              className="select select-bordered w-full" required>
              <option value="" disabled>Select your country</option>
              {countryList.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          {cities.length > 0 && (
            <div>
              <label className="label">City</label>
              <select name="city" value={userProfile.city} onChange={handleChange}
                className="select select-bordered w-full" required>
                <option value="" disabled>Select your city</option>
                {/* This key: city-index is used to avoid similar keys, since some cities have same names */}
                {cities.map((city, index) => (
                  <option key={`${city}-${index}`} value={city}>{city}</option>
                ))}
              </select>
            </div>
          )}

          {hasModifiedProfile && (
            <div className="text-center mt-6">
              <button type="submit" disabled={isPending} className="btn btn-primary w-full">
                {!isPending ? (
                  <>
                    <ShipWheelIcon className="size-5 mr-2" />
                    Update Profile
                  </>
                ) : (
                  <>
                    <LoaderIcon className="animate-spin size-5 mr-2" />
                    Updating Profile...
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;