import { Briefcase, Mail, MapPin, Phone, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../shared/api.js";
import { Badge } from "./ui/badge.jsx";
import { Button } from "./ui/button.jsx";
import { Card } from "./ui/card.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs.jsx";

export default function LawyerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('🔍 Debug - LawyerProfile component mounted with ID:', id);

  useEffect(() => {
    fetchLawyerFromAPI();
  }, [id]);

  const fetchLawyerFromAPI = async () => {
    try {
      console.log('🔍 Debug - LawyerProfile fetching for ID:', id);
      console.log('🔍 Debug - LawyerProfile ID type:', typeof id);
      
      // First try to get from approved lawyers list
      const response = await api.get('/appointments/lawyers?status=approved');
      console.log('🔍 Debug - Approved lawyers response:', response);
      
      const lawyersData = response.data?.lawyers || response.data || [];
      console.log('🔍 Debug - Lawyers data:', lawyersData);
      
      const foundLawyer = lawyersData.find(l => l._id === id || l.userId === id);
      console.log('🔍 Debug - Found lawyer:', foundLawyer);
      
      if (foundLawyer) {
        // Transform API data to match our component structure
        const apiLawyer = {
          id: foundLawyer._id || foundLawyer.userId,
          name: foundLawyer.fullName || `${foundLawyer.firstname || ''} ${foundLawyer.lastname || ''}`,
          expertise: foundLawyer.specialization || foundLawyer.occupation || "General Law",
          specialization: foundLawyer.specialization || foundLawyer.occupation || "General Law",
          rating: 4.5,
          reviews: 50,
          location: [foundLawyer.city, foundLawyer.state, foundLawyer.country].filter(Boolean).join(', ') || "Pakistan",
          experience: `${foundLawyer.yearsOfExperience || 0}+ years`,
          about: foundLawyer.bio || "Experienced lawyer providing quality legal services.",
          areas: [foundLawyer.specialization || foundLawyer.occupation || "General Law"],
          languages: ["English", "Urdu"],
          email: foundLawyer.email,
          photoUrl: foundLawyer.photoUrl || "",
        };
        setLawyer(apiLawyer);
        
        // Set payment methods if available
        if (foundLawyer.paymentMethods) {
          setPaymentMethods(foundLawyer.paymentMethods);
        }
      } else {
        console.log('🔍 Debug - Lawyer not found in approved list, trying direct user fetch...');
        // If not found in approved list, try to get user directly
        const userResponse = await api.get(`/user/${id}`);
        console.log('🔍 Debug - Direct user response:', userResponse);
        
        const user = userResponse.data?.user || userResponse.data
        console.log('🔍 Debug - User data:', user);
        
        if (user && user.userType === 'lawyer') {
          const apiLawyer = {
            id: user._id,
            name: `${user.firstname} ${user.lastname}`,
            expertise: user.occupation || "General Law",
            specialization: user.occupation || "General Law",
            rating: 4.5,
            reviews: 50,
            location: "Pakistan",
            experience: "5+ years",
            about: user.bio || "Experienced lawyer providing quality legal services.",
            areas: ["General Law"],
            languages: ["English", "Urdu"],
            email: user.email,
            photoUrl: user.photoUrl || "",
          };
          setLawyer(apiLawyer);
        }
      }
    } catch (error) {
      console.error("Error fetching lawyer:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.status,
        data: error.data
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContactLawyer = () => {
    console.log('🔍 Debug - handleContactLawyer called');
    console.log('🔍 Debug - Current ID:', id);
    console.log('🔍 Debug - Navigation target:', `/lawyers/${id}/book`);
    
    try {
      navigate(`/lawyers/${id}/book`);
      console.log('🔍 Debug - Navigation successful');
    } catch (error) {
      console.error('🔍 Debug - Navigation error:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading lawyer profile...
      </div>
    );
  }

  if (!lawyer) {
    console.log('🔍 Debug - No lawyer data found, showing not found message');
    return (
      <div className="p-6 text-center text-gray-600">
        Lawyer not found.
      </div>
    );
  }

  console.log('🔍 Debug - Lawyer data loaded:', lawyer);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 max-w-6xl mx-auto">
      {/* Left Sidebar */}
      <Card className="w-full md:w-1/3 p-6 flex flex-col items-center text-center">
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4">
          {lawyer.photoUrl ? (
            <img src={lawyer.photoUrl} alt={lawyer.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400">No Image</span>
          )}
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

        <div className="mt-6 w-full">
          <Button 
            className="w-full bg-lightbrown hover:bg-white hover:text-black hover:border-black border-2 border-lightbrown text-white transition-all duration-200 cursor-pointer" 
            onClick={() => {
              console.log('🔍 Debug - Contact Lawyer button clicked');
              handleContactLawyer();
            }}
          >
            Contact Lawyer
          </Button>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Debug: Button should be visible and clickable
          </div>
        </div>
      </Card>

      {/* Right Section */}
      <Card className="w-full md:w-2/3 p-6">
        <Tabs defaultValue="about">
          <TabsList className="grid grid-cols-5 w-full mb-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="expertise">Expertise</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
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
              <Button 
                variant="outline" 
                onClick={() => {
                  console.log('🔍 Debug - Schedule Consultation button clicked');
                  handleContactLawyer();
                }}
              >
                Schedule a Consultation
              </Button>
            </div>
          </TabsContent>

          {/* Other Tabs Placeholder */}
          <TabsContent value="expertise">
            <p className="text-gray-600">{lawyer.expertise} details go here...</p>
          </TabsContent>
          <TabsContent value="credentials">
            <p className="text-gray-600">Credentials details go here...</p>
          </TabsContent>
          
          {/* Payment Methods Section */}
          <TabsContent value="payment">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">💳</span>
              Payment Methods
            </h3>
            
            {paymentMethods ? (
              <div className="space-y-4">
                {/* JazzCash */}
                {paymentMethods.jazzcash?.enabled && (
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">📱</span>
                      <h4 className="font-semibold text-gray-900">JazzCash</h4>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Number:</span> {paymentMethods.jazzcash.accountNumber}</p>
                      <p><span className="font-medium">Account Name:</span> {paymentMethods.jazzcash.accountName}</p>
                    </div>
                  </div>
                )}
                
                {/* EasyPaisa */}
                {paymentMethods.easypaisa?.enabled && (
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">💳</span>
                      <h4 className="font-semibold text-gray-900">EasyPaisa</h4>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Number:</span> {paymentMethods.easypaisa.accountNumber}</p>
                      <p><span className="font-medium">Account Name:</span> {paymentMethods.easypaisa.accountName}</p>
                    </div>
                  </div>
                )}
                
                {/* Bank Transfer */}
                {paymentMethods.bankTransfer?.enabled && (
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🏦</span>
                      <h4 className="font-semibold text-gray-900">Bank Transfer</h4>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Bank:</span> {paymentMethods.bankTransfer.bankName}</p>
                      <p><span className="font-medium">Account Number:</span> {paymentMethods.bankTransfer.accountNumber}</p>
                      <p><span className="font-medium">Account Name:</span> {paymentMethods.bankTransfer.accountName}</p>
                      {paymentMethods.bankTransfer.iban && (
                        <p><span className="font-medium">IBAN:</span> {paymentMethods.bankTransfer.iban}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Cash on Meeting - Always Available */}
                <div className="p-4 border border-amber-200 rounded-lg bg-amber-50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">💵</span>
                    <h4 className="font-semibold text-amber-900">Cash on Meeting</h4>
                  </div>
                  <p className="text-sm text-amber-700">
                    You can also pay in cash when you meet the lawyer in person.
                  </p>
                </div>
                
                {!paymentMethods.jazzcash?.enabled && !paymentMethods.easypaisa?.enabled && !paymentMethods.bankTransfer?.enabled && (
                  <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                    <p className="text-sm text-yellow-700">
                      This lawyer currently only accepts cash payments. You can pay when you meet in person.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-gray-600 text-sm">
                  Payment methods information is not available. Please contact the lawyer directly for payment details.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="reviews">
            <p className="text-gray-600">Reviews go here...</p>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
