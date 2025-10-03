import { useParams, useNavigate } from "react-router-dom";
import { lawyers } from "@/data/Lawyers"; // adjust path if needed
import { lawyerAPI } from "@/services/api";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, Mail, Briefcase } from "lucide-react";

export default function LawyerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Try to find lawyer in static data first, then fetch from API
  useEffect(() => {
    const staticLawyer = lawyers.find((l) => l.id.toString() === id);
    if (staticLawyer) {
      setLawyer(staticLawyer);
      setLoading(false);
    } else {
      // If not found in static data, try to fetch from API
      fetchLawyerFromAPI();
    }
  }, [id]);

  const fetchLawyerFromAPI = async () => {
    try {
      const response = await lawyerAPI.getLawyerById(id);
      if (response.success && response.lawyer) {
        // Transform API data to match our component structure
        const apiLawyer = {
          id: response.lawyer._id,
          name: `${response.lawyer.firstname} ${response.lawyer.lastname}`,
          expertise: response.lawyer.occupation || "General Law",
          specialization: response.lawyer.occupation || "General Law",
          rating: 4.5,
          reviews: 50,
          location: "Pakistan",
          experience: "5+ years",
          about: response.lawyer.bio || "Experienced lawyer providing quality legal services.",
          areas: ["General Law"],
          languages: ["English", "Urdu"],
        };
        setLawyer(apiLawyer);
      }
    } catch (error) {
      console.error("Error fetching lawyer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactLawyer = () => {
    const resolvedId = id || lawyer?.id || lawyer?._id;
    if (!resolvedId) return;
    navigate(`/lawyers/${resolvedId}/book`);
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading lawyer profile...
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="p-6 text-center text-gray-600">
        Lawyer not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 max-w-6xl mx-auto">
      {/* Left Sidebar */}
      <Card className="w-full md:w-1/3 p-6 flex flex-col items-center text-center">
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
          <span className="text-gray-400">No Image</span>
        </div>
        <h2 className="text-xl font-semibold">{lawyer.name}</h2>
        <p className="text-gray-600">{lawyer.expertise}</p>
        <div className="flex items-center justify-center mt-2 text-yellow-500">
          <Star className="w-4 h-4 fill-yellow-500" />
          <span className="ml-1 font-medium text-gray-800">{lawyer.rating}</span>
          <span className="ml-1 text-gray-500 text-sm">
            ({lawyer.reviews} reviews)
          </span>
        </div>

        <div className="mt-6 space-y-3 text-gray-600 text-sm w-full">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{lawyer.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>Contact to view</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>Contact to view</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            <span>{lawyer.experience} experience</span>
          </div>
        </div>

        <Button className="mt-6 w-full" onClick={handleContactLawyer}>Contact Lawyer</Button>
      </Card>

      {/* Right Section */}
      <Card className="w-full md:w-2/3 p-6">
        <Tabs defaultValue="about">
          <TabsList className="grid grid-cols-4 w-full mb-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="expertise">Expertise</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* About Section */}
          <TabsContent value="about">
            <h3 className="text-lg font-semibold mb-2">About {lawyer.name}</h3>
            <p className="text-gray-600 mb-4">{lawyer.about}</p>
            <div>
              <h4 className="font-semibold mb-2">Languages</h4>
              <div className="flex gap-2 mb-4">
                {lawyer.languages.map((lang) => (
                  <Badge key={lang}>{lang}</Badge>
                ))}
              </div>
              <Button variant="outline" onClick={handleContactLawyer}>Schedule a Consultation</Button>
            </div>
          </TabsContent>

          {/* Other Tabs Placeholder */}
          <TabsContent value="expertise">
            <p className="text-gray-600">{lawyer.expertise} details go here...</p>
          </TabsContent>
          <TabsContent value="credentials">
            <p className="text-gray-600">Credentials details go here...</p>
          </TabsContent>
          <TabsContent value="reviews">
            <p className="text-gray-600">Reviews go here...</p>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
